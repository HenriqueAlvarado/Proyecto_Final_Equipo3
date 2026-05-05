const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

const ROLES_VALIDOS = ['recepcionista', 'medico', 'director'];

// POST /api/auth/register — Solo el director puede crear usuarios
router.post('/register', authMiddleware, requireRole('director'), async (req, res) => {
  const { nombre, apellido, email, password, rol, especialidad, cedula_profesional } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !email || !password || !rol) {
    return res.status(400).json({ message: 'Nombre, apellido, email, contraseña y rol son requeridos' });
  }
  if (!ROLES_VALIDOS.includes(rol)) {
    return res.status(400).json({ message: `Rol inválido. Debe ser: ${ROLES_VALIDOS.join(', ')}` });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
  }
  if (rol === 'medico' && !especialidad) {
    return res.status(400).json({ message: 'La especialidad es requerida para médicos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar email duplicado
    const existe = await client.query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase().trim()]);
    if (existe.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `INSERT INTO usuarios (nombre, apellido, email, password_hash, rol)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, email, rol`,
      [nombre.trim(), apellido.trim(), email.toLowerCase().trim(), password_hash, rol]
    );
    const nuevoUsuario = userResult.rows[0];

    // Si es médico, crear registro en tabla medicos
    if (rol === 'medico') {
      await client.query(
        `INSERT INTO medicos (usuario_id, especialidad, cedula_profesional)
         VALUES ($1, $2, $3)`,
        [nuevoUsuario.id, especialidad.trim(), cedula_profesional?.trim() || null]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: nuevoUsuario,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error al crear el usuario' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login-paciente — Login exclusivo para pacientes
router.post('/login-paciente', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash FROM pacientes WHERE email = $1 AND activo = TRUE',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const paciente = result.rows[0];

    if (!paciente.password_hash) {
      return res.status(401).json({ message: 'Esta cuenta no tiene acceso habilitado. Contacta a recepción.' });
    }

    const validPassword = await bcrypt.compare(password, paciente.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: paciente.id, email: paciente.email, rol: 'paciente', nombre: paciente.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        email: paciente.email,
        rol: 'paciente',
      },
    });
  } catch (err) {
    console.error('Error en login paciente:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/auth/mis-citas — Citas del paciente autenticado
router.get('/mis-citas', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'paciente') {
    return res.status(403).json({ message: 'Solo disponible para pacientes' });
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
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash, rol FROM usuarios WHERE email = $1 AND activo = TRUE',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/auth/usuarios — Director ve todos los usuarios
router.get('/usuarios', authMiddleware, requireRole('director'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.rol, u.activo, u.created_at,
              m.especialidad, m.cedula_profesional
       FROM usuarios u
       LEFT JOIN medicos m ON m.usuario_id = u.id
       ORDER BY u.rol, u.apellido, u.nombre`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// PATCH /api/auth/usuarios/:id/toggle — Director activa/desactiva usuario
router.patch('/usuarios/:id/toggle', authMiddleware, requireRole('director'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE usuarios SET activo = NOT activo, updated_at = NOW()
       WHERE id = $1 AND id != $2 RETURNING id, nombre, apellido, email, rol, activo`,
      [id, req.user.id] // No puede desactivarse a sí mismo
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o no puedes desactivarte a ti mismo' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// POST /api/auth/logout (el cliente elimina el token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;
