const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/pacientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, telefono, fecha_nacimiento, curp FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pacientes' });
  }
});

// GET /api/pacientes/buscar?q=texto
router.get('/buscar', async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.status(400).json({ message: 'Ingresa al menos 2 caracteres' });
  }
  try {
    const search = `%${q.toLowerCase()}%`;
    const result = await pool.query(
      `SELECT id, nombre, apellido, email, telefono, curp
       FROM pacientes
       WHERE activo = TRUE AND (
         LOWER(nombre) LIKE $1 OR
         LOWER(apellido) LIKE $1 OR
         LOWER(email) LIKE $1 OR
         LOWER(curp) LIKE $1
       )
       ORDER BY apellido, nombre LIMIT 20`,
      [search]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error en la búsqueda' });
  }
});

// GET /api/pacientes/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE id = $1 AND activo = TRUE',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener paciente' });
  }
});

// POST /api/pacientes
router.post('/', async (req, res) => {
  const { nombre, apellido, email, telefono, fecha_nacimiento, curp, direccion } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO pacientes (nombre, apellido, email, telefono, fecha_nacimiento, curp, direccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, apellido, email || null, telefono || null, fecha_nacimiento || null, curp || null, direccion || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Ya existe un paciente con ese correo o CURP' });
    }
    res.status(500).json({ message: 'Error al registrar paciente' });
  }
});

module.exports = router;
