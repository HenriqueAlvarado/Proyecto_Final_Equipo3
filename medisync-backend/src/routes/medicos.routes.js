const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/medicos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id, u.nombre, u.apellido, u.email, m.especialidad, m.cedula_profesional, m.foto_url
       FROM medicos m
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE u.activo = TRUE
       ORDER BY u.apellido, u.nombre`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener médicos' });
  }
});

// GET /api/medicos/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id, u.nombre, u.apellido, u.email, m.especialidad, m.cedula_profesional, m.foto_url
       FROM medicos m
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE m.id = $1 AND u.activo = TRUE`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Médico no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener médico' });
  }
});

module.exports = router;
