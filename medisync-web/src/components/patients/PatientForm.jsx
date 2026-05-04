import React, { useState } from 'react';
import { createPatient } from '../../services/patientService';
import Input from '../common/Input';
import Button from '../common/Button';

const PatientForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    fecha_nacimiento: '', curp: '', direccion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'El nombre es requerido';
    if (!form.apellido) e.apellido = 'El apellido es requerido';
    if (!form.email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.telefono) e.telefono = 'El teléfono es requerido';
    if (!form.fecha_nacimiento) e.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await createPatient(form);
      onSuccess();
    } catch (err) {
      setErrors({ general: err.message || 'Error al registrar paciente' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Registrar nuevo paciente</h2>
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
      <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} required />
      <Input id="apellido" name="apellido" label="Apellido" value={form.apellido} onChange={handleChange} error={errors.apellido} required />
      <Input id="email" name="email" type="email" label="Correo electrónico" value={form.email} onChange={handleChange} error={errors.email} required />
      <Input id="telefono" name="telefono" label="Teléfono" value={form.telefono} onChange={handleChange} error={errors.telefono} required />
      <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" label="Fecha de nacimiento" value={form.fecha_nacimiento} onChange={handleChange} error={errors.fecha_nacimiento} required />
      <Input id="curp" name="curp" label="CURP" placeholder="Opcional" value={form.curp} onChange={handleChange} />
      <Input id="direccion" name="direccion" label="Dirección" placeholder="Opcional" value={form.direccion} onChange={handleChange} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button type="submit" loading={loading}>Registrar paciente</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

export default PatientForm;
