import React, { useState } from 'react';
import { updateAppointment } from '../../services/appointmentService';
import Input from '../common/Input';
import Button from '../common/Button';

const EditAppointmentForm = ({ cita, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    fecha: cita.fecha || '',
    hora: cita.hora?.slice(0, 5) || '',
    motivo: cita.motivo || '',
    notas: cita.notas || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fecha || !form.hora || !form.motivo) {
      setErrors({ general: 'Fecha, hora y motivo son requeridos' });
      return;
    }
    setLoading(true);
    try {
      await updateAppointment(cita.id, form);
      onSuccess();
    } catch (err) {
      setErrors({ general: err.message || 'Error al actualizar la cita' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Editar cita</h2>
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

      <Input
        id="fecha" name="fecha" type="date" label="Fecha"
        value={form.fecha} onChange={handleChange} required
      />
      <Input
        id="hora" name="hora" type="time" label="Hora"
        value={form.hora} onChange={handleChange} required
      />
      <Input
        id="motivo" name="motivo" label="Motivo de consulta"
        value={form.motivo} onChange={handleChange} required
      />

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="notas"
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-700)',
            fontWeight: 500,
          }}
        >
          Notas de consulta <span style={{ color: 'var(--color-gray-500)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={3}
          placeholder="Observaciones, indicaciones, diagnóstico..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--color-gray-300)',
            borderRadius: '6px',
            fontSize: 'var(--font-size-md)',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button type="submit" loading={loading}>Guardar cambios</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

export default EditAppointmentForm;
