import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="login-page">
      <div className="login-page__card">
        <div className="login-page__logo" aria-hidden="true">🏥</div>
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
