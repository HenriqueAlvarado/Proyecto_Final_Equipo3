/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
};

/**
 * Formatea una hora HH:MM a formato 12h
 * @param {string} timeStr - Hora en formato HH:MM
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

/**
 * Formatea nombre completo
 */
export const formatFullName = (nombre, apellido) =>
  [nombre, apellido].filter(Boolean).join(' ');
