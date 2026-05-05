import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import LoginPacienteForm from '../components/auth/LoginPacienteForm';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const { user } = useAuth();
  const [modo, setModo] = useState('staff'); // 'staff' | 'paciente'

  if (user) {
    return <Navigate to={user.rol === 'paciente' ? '/mis-citas' : '/dashboard'} replace />;
  }

  return (
    <main className="login-page">
      <div className="login-page__card">
        <div className="login-page__logo" aria-hidden="true">🏥</div>

        {/* Tabs de modo */}
        <div className="login-page__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={modo === 'staff'}
            className={`login-page__tab ${modo === 'staff' ? 'login-page__tab--active' : ''}`}
            onClick={() => setModo('staff')}
          >
            Personal clínico
          </button>
          <button
            role="tab"
            aria-selected={modo === 'paciente'}
            className={`login-page__tab ${modo === 'paciente' ? 'login-page__tab--active' : ''}`}
            onClick={() => setModo('paciente')}
          >
            Soy paciente
          </button>
        </div>

        {modo === 'staff'
          ? <LoginForm />
          : <LoginPacienteForm />
        }
      </div>
    </main>
  );
};

export default LoginPage;
