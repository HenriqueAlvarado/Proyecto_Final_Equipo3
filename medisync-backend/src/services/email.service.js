const axios = require('axios');

/**
 * Envía correo de confirmación de cita usando SendGrid API
 * @param {object} cita - Datos de la cita
 */
const sendAppointmentEmail = async (cita) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY no configurada, omitiendo envío de correo');
    return;
  }

  const { paciente_email, paciente_nombre, medico_nombre, fecha, hora, motivo } = cita;
  if (!paciente_email) return;

  const emailData = {
    personalizations: [{
      to: [{ email: paciente_email }],
      subject: 'Confirmación de cita - Clínica San Ángel',
    }],
    from: { email: process.env.SENDGRID_FROM || 'noreply@clinicasanangel.com', name: 'Clínica San Ángel' },
    content: [{
      type: 'text/html',
      value: `
        <h2>Confirmación de cita médica</h2>
        <p>Estimado/a <strong>${paciente_nombre}</strong>,</p>
        <p>Su cita ha sido agendada exitosamente:</p>
        <ul>
          <li><strong>Médico:</strong> Dr. ${medico_nombre}</li>
          <li><strong>Fecha:</strong> ${fecha}</li>
          <li><strong>Hora:</strong> ${hora}</li>
          <li><strong>Motivo:</strong> ${motivo}</li>
        </ul>
        <p>Por favor llegue 10 minutos antes de su cita.</p>
        <p>Clínica San Ángel</p>
      `,
    }],
  };

  await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  console.log(`✉️ Correo enviado a ${paciente_email}`);
};

module.exports = { sendAppointmentEmail };
