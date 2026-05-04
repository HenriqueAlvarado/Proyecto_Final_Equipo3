import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import './LoginForm.css';

const LoginForm = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
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
      await login(form.email, form.password);
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h1 className="login-form__title">Iniciar sesión</h1>
      <p className="login-form__subtitle">Clínica San Ángel</p>

      {serverError && (
        <div className="login-form__error" role="alert">
          {serverError}
        </div>
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="usuario@clinica.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
        autoComplete="current-password"
      />

      <Button type="submit" fullWidth loading={loading}>
        Ingresar
      </Button>
    </form>
  );
};

export default LoginForm;
