/**
 * PRUEBAS UNITARIAS - Middleware de Autenticación
 * Archivo: src/middleware/auth.middleware.js
 *
 * Casos de prueba:
 *   TC-01: Token ausente → 401
 *   TC-02: Token con formato incorrecto (sin "Bearer ") → 401
 *   TC-03: Token inválido/expirado → 401
 *   TC-04: Token válido → next() y req.user poblado
 *   TC-05: requireRole con rol correcto → next()
 *   TC-06: requireRole con rol incorrecto → 403
 */

const jwt = require('jsonwebtoken');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// Configurar JWT_SECRET para las pruebas
process.env.JWT_SECRET = 'test_secret_medisync_2026';

// Helper para crear mocks de req, res, next
const mockReqResNext = (authHeader = null) => {
  const req = { headers: {} };
  if (authHeader) req.headers.authorization = authHeader;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

// ─────────────────────────────────────────────
// TC-01: Sin header Authorization
// ─────────────────────────────────────────────
test('TC-01: Sin token → responde 401 con mensaje "Token no proporcionado"', () => {
  const { req, res, next } = mockReqResNext();

  authMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
  expect(next).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-02: Header sin prefijo "Bearer "
// ─────────────────────────────────────────────
test('TC-02: Token sin prefijo Bearer → responde 401', () => {
  const { req, res, next } = mockReqResNext('tokensinprefijo');

  authMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-03: Token con firma inválida
// ─────────────────────────────────────────────
test('TC-03: Token inválido → responde 401 con mensaje "Token inválido o expirado"', () => {
  const { req, res, next } = mockReqResNext('Bearer token.invalido.firma');

  authMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
  expect(next).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-04: Token válido → llama next() y puebla req.user
// ─────────────────────────────────────────────
test('TC-04: Token válido → llama next() y req.user contiene los datos del usuario', () => {
  const payload = { id: 1, email: 'recep@clinica.com', rol: 'recepcionista' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  const { req, res, next } = mockReqResNext(`Bearer ${token}`);

  authMiddleware(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(req.user).toMatchObject(payload);
  expect(res.status).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-05: requireRole con rol permitido → llama next()
// ─────────────────────────────────────────────
test('TC-05: requireRole con rol correcto → llama next()', () => {
  const { req, res, next } = mockReqResNext();
  req.user = { id: 1, rol: 'director' };

  const middleware = requireRole('director', 'recepcionista');
  middleware(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(res.status).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-06: requireRole con rol no permitido → 403
// ─────────────────────────────────────────────
test('TC-06: requireRole con rol incorrecto → responde 403', () => {
  const { req, res, next } = mockReqResNext();
  req.user = { id: 2, rol: 'paciente' };

  const middleware = requireRole('director', 'recepcionista');
  middleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para esta acción' });
  expect(next).not.toHaveBeenCalled();
});
