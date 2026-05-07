/**
 * PRUEBAS UNITARIAS - Formateadores
 * Archivo: src/utils/formatters.js
 *
 * Casos de prueba:
 *   TC-21: formatDate con fecha válida → formato legible en español
 *   TC-22: formatDate con valor vacío → retorna ''
 *   TC-23: formatTime con hora AM → formato 12h con AM
 *   TC-24: formatTime con hora PM → formato 12h con PM
 *   TC-25: formatTime con medianoche (00:00) → 12:00 AM
 *   TC-26: formatTime con mediodía (12:00) → 12:00 PM
 *   TC-27: formatTime con valor vacío → retorna ''
 *   TC-28: formatFullName con nombre y apellido → concatena correctamente
 *   TC-29: formatFullName con solo nombre → retorna solo el nombre
 *   TC-30: formatFullName con valores vacíos → retorna ''
 */

import { formatDate, formatTime, formatFullName } from '../utils/formatters';

// ─────────────────────────────────────────────
// formatDate
// ─────────────────────────────────────────────
describe('formatDate', () => {
  test('TC-21: Fecha válida → formato legible en español', () => {
    const result = formatDate('2026-05-07');
    // Debe contener el día, mes en español y año
    expect(result).toContain('2026');
    expect(result).toContain('7');
    expect(result.toLowerCase()).toContain('mayo');
  });

  test('TC-22: Valor vacío o null → retorna string vacío', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

// ─────────────────────────────────────────────
// formatTime
// ─────────────────────────────────────────────
describe('formatTime', () => {
  test('TC-23: Hora AM (09:30) → "9:30 AM"', () => {
    expect(formatTime('09:30')).toBe('9:30 AM');
  });

  test('TC-24: Hora PM (14:45) → "2:45 PM"', () => {
    expect(formatTime('14:45')).toBe('2:45 PM');
  });

  test('TC-25: Medianoche (00:00) → "12:00 AM"', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  test('TC-26: Mediodía (12:00) → "12:00 PM"', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  test('TC-27: Valor vacío → retorna string vacío', () => {
    expect(formatTime('')).toBe('');
    expect(formatTime(null)).toBe('');
  });
});

// ─────────────────────────────────────────────
// formatFullName
// ─────────────────────────────────────────────
describe('formatFullName', () => {
  test('TC-28: Nombre y apellido → concatena con espacio', () => {
    expect(formatFullName('Henrique', 'Alvarado')).toBe('Henrique Alvarado');
  });

  test('TC-29: Solo nombre, sin apellido → retorna solo el nombre', () => {
    expect(formatFullName('Henrique', '')).toBe('Henrique');
    expect(formatFullName('Henrique', null)).toBe('Henrique');
  });

  test('TC-30: Ambos vacíos → retorna string vacío', () => {
    expect(formatFullName('', '')).toBe('');
    expect(formatFullName(null, null)).toBe('');
  });
});
