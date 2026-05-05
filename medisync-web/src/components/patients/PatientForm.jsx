import React, { useState } from 'react';
import { createPatient } from '../../services/patientService';
import Input from '../common/Input';
import Button from '../common/Button';
import './PatientForm.css';

const PatientForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '',
    telefono: '', fecha_nacimiento: '', curp: '', direccion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'El nombre es requerido';
    if (!form.apellido) e.apellido = 'El apellido es requerido';
    if (!form.email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
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
      // Guardar credenciales para mostrarlas al recepcionista
      setCreatedCredentials({ email: form.email, password: form.password });
    } catch (err) {
      setErrors({ general: err.message || 'Error al registrar paciente' });
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de confirmacion con credenciales
  if (createdCredentials) {
    return (
      <div className="patient-form__credentials">
        <div className="patient-form__credentials-icon">✅</div>
        <h2>Paciente registrado exitosamente</h2>
        <p>Entrega estas credenciales al paciente para que pueda ver sus citas:</p>
        <div className="patient-form__credentials-box">
          <div className="patient-form__credential-item">
            <span className="patient-form__credential-label">Correo:</span>
            <span className="patient-form__credential-value">{createdCredentials.email}</span>
          </div>
          <div className="patient-form__credential-item">
            <span className="patient-form__credential-label">Contraseña:</span>
            <span className="patient-form__credential-value">{createdCredentials.password}</span>
          </div>
        </div>
        <p className="patient-form__credentials-note">
          El paciente puede ingresar en la sección "Soy paciente" de la pantalla de login.
        </p>
        <Button onClick={onSuccess}>Aceptar</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Registrar nuevo paciente</h2>
      {errors.general && <p style={{ color: 'red', marginBottom: '12px' }}>{errors.general}</p>}

      <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} required />
      <Input id="apellido" name="apellido" label="Apellido" value={form.apellido} onChange={handleChange} error={errors.apellido} required />
      <Input id="email" name="email" type="email" label="Correo electrónico" value={form.email} onChange={handleChange} error={errors.email} required />
      <Input id="password" name="password" type="password" label="Contraseña de acceso" placeholder="El paciente usará esta contraseña para ver sus citas" value={form.password} onChange={handleChange} error={errors.password} required />
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
