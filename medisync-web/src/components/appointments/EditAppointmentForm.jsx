import React, { useState } from 'react';
import { updateAppointment } from '../../services/appointmentService';
import Input from '../common/Input';
import Button from '../common/Button';

const EditAppointmentForm = ({ cita, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    fecha: cita.fecha || '',
    hora: cita.hora || '',
    motivo: cita.motivo || '',
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
      setErrors({ general: 'Todos los campos son requeridos' });
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
      <Input id="fecha" name="fecha" type="date" label="Fecha" value={form.fecha} onChange={handleChange} required />
      <Input id="hora" name="hora" type="time" label="Hora" value={form.hora} onChange={handleChange} required />
      <Input id="motivo" name="motivo" label="Motivo" value={form.motivo} onChange={handleChange} required />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button type="submit" loading={loading}>Guardar cambios</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

export default EditAppointmentForm;
