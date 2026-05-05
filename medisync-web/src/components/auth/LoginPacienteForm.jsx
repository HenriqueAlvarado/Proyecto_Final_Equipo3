import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginPacienteForm = () => {
  const { loginPaciente } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'El correo es requerido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      await loginPaciente(form.email, form.password);
      navigate('/mis-citas', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="login-form__title">Acceso pacientes</h1>
      <p className="login-form__subtitle">Ingresa con las credenciales que te dio recepción</p>

      {serverError && (
        <div className="login-form__error" role="alert">{serverError}</div>
      )}

      <Input id="email-paciente" name="email" type="email" label="Correo electrónico"
        placeholder="tu@correo.com" value={form.email} onChange={handleChange}
        error={errors.email} required autoComplete="email" />

      <Input id="password-paciente" name="password" type="password" label="Contraseña"
        placeholder="••••••••" value={form.password} onChange={handleChange}
        error={errors.password} required autoComplete="current-password" />

      <Button type="submit" fullWidth loading={loading}>Ingresar</Button>
    </form>
  );
};

export default LoginPacienteForm;
