/**
 * PRUEBAS UNITARIAS - Servicio de Email (SendGrid)
 * Archivo: src/services/email.service.js
 *
 * Casos de prueba:
 *   TC-07: Sin API Key → no llama a axios, retorna sin error
 *   TC-08: Sin email del paciente → no llama a axios
 *   TC-09: Datos completos → llama a axios con payload correcto
 *   TC-10: Error de axios → lanza el error (para que el caller lo capture)
 */

const axios = require('axios');
const { sendAppointmentEmail } = require('../services/email.service');

// Mock de axios para no hacer llamadas reales a SendGrid
jest.mock('axios');

const citaCompleta = {
  paciente_email: 'paciente@gmail.com',
  paciente_nombre: 'Juan García',
  medico_nombre: 'María López',
  fecha: '2026-05-10',
  hora: '10:00',
  motivo: 'Consulta general',
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────
// TC-07: Sin SENDGRID_API_KEY configurada
// ─────────────────────────────────────────────
test('TC-07: Sin API Key → no llama a axios y retorna sin error', async () => {
  delete process.env.SENDGRID_API_KEY;

  await expect(sendAppointmentEmail(citaCompleta)).resolves.toBeUndefined();
  expect(axios.post).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-08: Sin email del paciente
// ─────────────────────────────────────────────
test('TC-08: Sin email del paciente → no llama a axios', async () => {
  process.env.SENDGRID_API_KEY = 'SG.test_key';

  const citaSinEmail = { ...citaCompleta, paciente_email: undefined };
  await sendAppointmentEmail(citaSinEmail);

  expect(axios.post).not.toHaveBeenCalled();
});

// ─────────────────────────────────────────────
// TC-09: Datos completos → llama a axios con payload correcto
// ─────────────────────────────────────────────
test('TC-09: Datos completos → llama a axios.post con URL y headers correctos', async () => {
  process.env.SENDGRID_API_KEY = 'SG.test_key';
  process.env.SENDGRID_FROM = 'test@clinica.com';
  axios.post.mockResolvedValue({ status: 202 });

  await sendAppointmentEmail(citaCompleta);

  expect(axios.post).toHaveBeenCalledTimes(1);

  const [url, body, config] = axios.post.mock.calls[0];

  // Verifica URL de SendGrid
  expect(url).toBe('https://api.sendgrid.com/v3/mail/send');

  // Verifica destinatario
  expect(body.personalizations[0].to[0].email).toBe('paciente@gmail.com');

  // Verifica remitente verificado
  expect(body.from.email).toBe('test@clinica.com');

  // Verifica que el contenido menciona al paciente y al médico
  expect(body.content[0].value).toContain('Juan García');
  expect(body.content[0].value).toContain('María López');

  // Verifica header de autorización
  expect(config.headers.Authorization).toBe('Bearer SG.test_key');
});

// ─────────────────────────────────────────────
// TC-10: Error de axios → propaga el error
// ─────────────────────────────────────────────
test('TC-10: Error de axios → la promesa es rechazada con el error', async () => {
  process.env.SENDGRID_API_KEY = 'SG.test_key';
  axios.post.mockRejectedValue(new Error('Network Error'));

  await expect(sendAppointmentEmail(citaCompleta)).rejects.toThrow('Network Error');
});
