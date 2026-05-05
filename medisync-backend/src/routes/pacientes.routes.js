const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/pacientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, telefono, fecha_nacimiento, curp, direccion FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre'
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
      `SELECT id, nombre, apellido, email, telefono, curp, direccion
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
      'SELECT id, nombre, apellido, email, telefono, fecha_nacimiento, curp, direccion FROM pacientes WHERE id = $1 AND activo = TRUE',
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
  const { nombre, apellido, email, password, telefono, fecha_nacimiento, curp, direccion } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
  }
  if (!email) {
    return res.status(400).json({ message: 'El correo es requerido' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO pacientes (nombre, apellido, email, password_hash, telefono, fecha_nacimiento, curp, direccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, apellido, email, telefono, fecha_nacimiento, curp, direccion`,
      [nombre, apellido, email.toLowerCase().trim(), password_hash,
       telefono || null, fecha_nacimiento || null, curp || null, direccion || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Ya existe un paciente con ese correo o CURP' });
    }
    res.status(500).json({ message: 'Error al registrar paciente' });
  }
});

// DELETE /api/pacientes/:id — Borrado logico (solo recepcionista y director)
router.delete('/:id', requireRole('recepcionista', 'director'), async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar que no tenga citas programadas activas
    const citasActivas = await pool.query(
      "SELECT COUNT(*) FROM citas WHERE paciente_id = $1 AND estado = 'programada'",
      [id]
    );
    if (parseInt(citasActivas.rows[0].count) > 0) {
      return res.status(409).json({
        message: 'No se puede eliminar: el paciente tiene citas programadas. Cancélalas primero.'
      });
    }

    const result = await pool.query(
      'UPDATE pacientes SET activo = FALSE, updated_at = NOW() WHERE id = $1 AND activo = TRUE RETURNING id, nombre, apellido',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente eliminado correctamente', paciente: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar paciente' });
  }
});

// GET /api/pacientes/:id/citas
router.get('/:id/citas', async (req, res) => {
  if (req.user.rol === 'paciente' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver estas citas' });
  }
  try {
    const result = await pool.query(
      `SELECT c.id, c.fecha, c.hora, c.motivo, c.estado, c.notas,
              u.nombre || ' ' || u.apellido AS medico_nombre,
              m.especialidad
       FROM citas c
       JOIN medicos m ON c.medico_id = m.id
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE c.paciente_id = $1
       ORDER BY c.fecha DESC, c.hora ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener citas del paciente' });
  }
});

module.exports = router;
