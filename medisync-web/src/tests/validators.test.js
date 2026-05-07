/**
 * PRUEBAS UNITARIAS - Validadores
 * Archivo: src/utils/validators.js
 *
 * Casos de prueba:
 *   TC-11: isValidEmail con email válido → true
 *   TC-12: isValidEmail con email inválido → false
 *   TC-13: isValidPhone con 10 dígitos → true
 *   TC-14: isValidPhone con menos de 10 dígitos → false
 *   TC-15: isValidCURP con CURP válida → true
 *   TC-16: isValidCURP con CURP inválida → false
 *   TC-17: isNotEmpty con valor con texto → true
 *   TC-18: isNotEmpty con string vacío → false
 *   TC-19: minLength cumple longitud mínima → true
 *   TC-20: minLength no cumple longitud mínima → false
 */

import {
  isValidEmail,
  isValidPhone,
  isValidCURP,
  isNotEmpty,
  minLength,
} from '../utils/validators';

// ─────────────────────────────────────────────
// isValidEmail
// ─────────────────────────────────────────────
describe('isValidEmail', () => {
  test('TC-11: Email válido → retorna true', () => {
    expect(isValidEmail('henrique.alvarado@gmail.com')).toBe(true);
    expect(isValidEmail('recep@clinicasanangel.com')).toBe(true);
  });

  test('TC-12: Email inválido → retorna false', () => {
    expect(isValidEmail('noesuncorreo')).toBe(false);
    expect(isValidEmail('falta@dominio')).toBe(false);
    expect(isValidEmail('@sinusuario.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isValidPhone
// ─────────────────────────────────────────────
describe('isValidPhone', () => {
  test('TC-13: Teléfono de 10 dígitos → retorna true', () => {
    expect(isValidPhone('8112345678')).toBe(true);
    expect(isValidPhone('811-234-5678')).toBe(true); // con guiones
    expect(isValidPhone('811 234 5678')).toBe(true); // con espacios
  });

  test('TC-14: Teléfono con menos o más de 10 dígitos → retorna false', () => {
    expect(isValidPhone('81123456')).toBe(false);    // 8 dígitos
    expect(isValidPhone('81123456789')).toBe(false); // 11 dígitos
    expect(isValidPhone('abcdefghij')).toBe(false);  // letras
  });
});

// ─────────────────────────────────────────────
// isValidCURP
// ─────────────────────────────────────────────
describe('isValidCURP', () => {
  test('TC-15: CURP con formato válido → retorna true', () => {
    expect(isValidCURP('AACH900101HNLRVR09')).toBe(true);
    expect(isValidCURP('GARM850315MDFRZR01')).toBe(true);
  });

  test('TC-16: CURP con formato inválido → retorna false', () => {
    expect(isValidCURP('12345678901234567')).toBe(false); // solo números
    expect(isValidCURP('CORTO')).toBe(false);             // muy corta
    expect(isValidCURP('')).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isNotEmpty
// ─────────────────────────────────────────────
describe('isNotEmpty', () => {
  test('TC-17: Valor con texto → retorna true', () => {
    expect(isNotEmpty('Henrique')).toBe(true);
    expect(isNotEmpty('  texto con espacios  ')).toBe(true);
  });

  test('TC-18: Valor vacío, null o undefined → retorna false', () => {
    expect(isNotEmpty('')).toBe(false);
    expect(isNotEmpty('   ')).toBe(false); // solo espacios
    expect(isNotEmpty(null)).toBe(false);
    expect(isNotEmpty(undefined)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// minLength
// ─────────────────────────────────────────────
describe('minLength', () => {
  test('TC-19: Valor que cumple longitud mínima → retorna true', () => {
    expect(minLength('password123', 8)).toBe(true);
    expect(minLength('abcdef', 6)).toBe(true);
    expect(minLength('exacto', 6)).toBe(true); // exactamente el mínimo
  });

  test('TC-20: Valor que no cumple longitud mínima → retorna falsy', () => {
    expect(minLength('corto', 8)).toBe(false);
    expect(minLength('abc', 6)).toBe(false);
    // minLength('', 1) retorna '' (falsy) porque '' && expr evalúa a ''
    expect(minLength('', 1)).toBeFalsy();
  });
});
