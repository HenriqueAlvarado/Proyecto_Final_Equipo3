import React, { useState } from 'react';
import { registerUser } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';
import './UserForm.css';

const ROLES = [
  { value: 'recepcionista', label: 'Recepcionista' },
  { value: 'medico', label: 'Médico' },
  { value: 'director', label: 'Director' },
];

const UserForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmar_password: '',
    rol: '',
    especialidad: '',
    cedula_profesional: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.apellido.trim()) e.apellido = 'El apellido es requerido';
    if (!form.email.trim()) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmar_password) e.confirmar_password = 'Las contraseñas no coinciden';
    if (!form.rol) e.rol = 'El rol es requerido';
    if (form.rol === 'medico' && !form.especialidad.trim()) e.especialidad = 'La especialidad es requerida para médicos';
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
      await registerUser({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        rol: form.rol,
        especialidad: form.especialidad || undefined,
        cedula_profesional: form.cedula_profesional || undefined,
      });
      onSuccess();
    } catch (err) {
      setErrors({ general: err.message || 'Error al crear el usuario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <h2 className="user-form__title">Nuevo usuario</h2>

      {errors.general && (
        <div className="user-form__error" role="alert">{errors.general}</div>
      )}

      <div className="user-form__row">
        <Input id="nombre" name="nombre" label="Nombre" value={form.nombre}
          onChange={handleChange} error={errors.nombre} required />
        <Input id="apellido" name="apellido" label="Apellido" value={form.apellido}
          onChange={handleChange} error={errors.apellido} required />
      </div>

      <Input id="email" name="email" type="email" label="Correo electrónico"
        value={form.email} onChange={handleChange} error={errors.email} required />

      <div className="user-form__row">
        <Input id="password" name="password" type="password" label="Contraseña"
          placeholder="Mínimo 8 caracteres" value={form.password}
          onChange={handleChange} error={errors.password} required />
        <Input id="confirmar_password" name="confirmar_password" type="password"
          label="Confirmar contraseña" value={form.confirmar_password}
          onChange={handleChange} error={errors.confirmar_password} required />
      </div>

      <div className="user-form__group">
        <label htmlFor="rol" className="user-form__label">
          Rol <span aria-hidden="true" style={{ color: 'var(--color-danger)' }}> *</span>
        </label>
        <select id="rol" name="rol" value={form.rol} onChange={handleChange}
          className={`user-form__select ${errors.rol ? 'user-form__select--error' : ''}`}>
          <option value="">-- Selecciona un rol --</option>
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.rol && <span className="user-form__field-error" role="alert">{errors.rol}</span>}
      </div>

      {/* Campos extra solo para médicos */}
      {form.rol === 'medico' && (
        <div className="user-form__medico-fields">
          <Input id="especialidad" name="especialidad" label="Especialidad"
            placeholder="Ej: Medicina General, Cardiología..." value={form.especialidad}
            onChange={handleChange} error={errors.especialidad} required />
          <Input id="cedula_profesional" name="cedula_profesional" label="Cédula profesional"
            placeholder="Opcional" value={form.cedula_profesional} onChange={handleChange} />
        </div>
      )}

      <div className="user-form__actions">
        <Button type="submit" loading={loading}>Crear usuario</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

export default UserForm;
