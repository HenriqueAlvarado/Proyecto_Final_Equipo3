const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth.middleware');
const { sendAppointmentEmail, sendCancellationEmail } = require('../services/email.service');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/citas?fecha=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { fecha } = req.query;
  try {
    let query = `
      SELECT c.id, c.fecha, c.hora, c.motivo, c.estado, c.notas,
             p.nombre || ' ' || p.apellido AS paciente_nombre, p.id AS paciente_id,
             u.nombre || ' ' || u.apellido AS medico_nombre, m.id AS medico_id,
             m.especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      JOIN usuarios u ON m.usuario_id = u.id
    `;
    const params = [];

    // Médico solo ve sus propias citas
    if (req.user.rol === 'medico') {
      const medResult = await pool.query('SELECT id FROM medicos WHERE usuario_id = $1', [req.user.id]);
      if (medResult.rows.length > 0) {
        params.push(medResult.rows[0].id);
        query += ` WHERE c.medico_id = $${params.length}`;
        if (fecha) { params.push(fecha); query += ` AND c.fecha = $${params.length}`; }
      }
    } else {
      if (fecha) { params.push(fecha); query += ` WHERE c.fecha = $${params.length}`; }
    }

    query += ' ORDER BY c.hora ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

// POST /api/citas
router.post('/', async (req, res) => {
  const { paciente_id, medico_id, fecha, hora, motivo } = req.body;

  if (!paciente_id || !medico_id || !fecha || !hora || !motivo) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar disponibilidad
    const conflict = await pool.query(
      "SELECT id FROM citas WHERE medico_id = $1 AND fecha = $2 AND hora = $3 AND estado != 'cancelada'",
      [medico_id, fecha, hora]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ message: 'El médico ya tiene una cita en ese horario' });
    }

    const result = await pool.query(
      `INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [paciente_id, medico_id, fecha, hora, motivo, req.user.id]
    );

    const cita = result.rows[0];

    // Obtener datos completos para el correo (el INSERT solo devuelve IDs)
    const citaCompleta = await pool.query(
      `SELECT c.fecha, c.hora, c.motivo,
              p.nombre || ' ' || p.apellido AS paciente_nombre, p.email AS paciente_email,
              u.nombre || ' ' || u.apellido AS medico_nombre
       FROM citas c
       JOIN pacientes p ON c.paciente_id = p.id
       JOIN medicos m ON c.medico_id = m.id
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE c.id = $1`,
      [cita.id]
    );

    // Enviar correo de confirmación (no bloquea la respuesta)
    if (citaCompleta.rows.length > 0) {
      sendAppointmentEmail(citaCompleta.rows[0]).catch(err => console.error('Error enviando correo:', err));
    }

    res.status(201).json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
});

// PUT /api/citas/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, motivo, notas } = req.body;

  try {
    const result = await pool.query(
      `UPDATE citas SET fecha = $1, hora = $2, motivo = $3, notas = $4, updated_at = NOW()
       WHERE id = $5 AND estado = 'programada' RETURNING *`,
      [fecha, hora, motivo, notas || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cita no encontrada o no se puede modificar' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
});

// PATCH /api/citas/:id/cancelar
router.patch('/:id/cancelar', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE citas SET estado = 'cancelada', updated_at = NOW()
       WHERE id = $1 AND estado = 'programada' RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cita no encontrada o ya fue cancelada' });
    }

    // Enviar correo de notificación de cancelación al paciente
    const citaCompleta = await pool.query(
      `SELECT c.fecha, c.hora, c.motivo,
              p.nombre || ' ' || p.apellido AS paciente_nombre, p.email AS paciente_email,
              u.nombre || ' ' || u.apellido AS medico_nombre
       FROM citas c
       JOIN pacientes p ON c.paciente_id = p.id
       JOIN medicos m ON c.medico_id = m.id
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    if (citaCompleta.rows.length > 0) {
      sendCancellationEmail(citaCompleta.rows[0]).catch(err => console.error('Error enviando correo cancelación:', err));
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al cancelar la cita' });
  }
});

// GET /api/citas/mis-citas (para médicos)
router.get('/mis-citas', async (req, res) => {
  try {
    const medResult = await pool.query('SELECT id FROM medicos WHERE usuario_id = $1', [req.user.id]);
    if (medResult.rows.length === 0) {
      return res.status(403).json({ message: 'No eres médico' });
    }
    const result = await pool.query(
      `SELECT c.*, p.nombre || ' ' || p.apellido AS paciente_nombre
       FROM citas c JOIN pacientes p ON c.paciente_id = p.id
       WHERE c.medico_id = $1 ORDER BY c.fecha DESC, c.hora ASC`,
      [medResult.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

module.exports = router;
