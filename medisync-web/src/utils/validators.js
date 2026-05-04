export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/\s|-/g, ''));

export const isValidCURP = (curp) =>
  /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp.toUpperCase());

export const isNotEmpty = (value) => value !== null && value !== undefined && value.trim() !== '';

export const minLength = (value, min) => value && value.length >= min;
