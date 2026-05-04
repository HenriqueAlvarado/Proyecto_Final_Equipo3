import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main style={{ textAlign: 'center', padding: '80px 20px' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--color-gray-300)' }}>404</h1>
    <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-600)', marginBottom: '24px' }}>
      Página no encontrada
    </p>
    <Link to="/dashboard" style={{ color: 'var(--color-primary)' }}>
      Volver al inicio
    </Link>
  </main>
);

export default NotFoundPage;
