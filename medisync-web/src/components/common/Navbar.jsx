import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar" role="banner">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">🏥</span>
        <span className="navbar__title">MediSync</span>
        <span className="navbar__subtitle">Clínica San Ángel</span>
      </div>
      <div className="navbar__user">
        <span className="navbar__user-name">{user?.nombre || 'Usuario'}</span>
        <span className="navbar__user-role">{user?.rol || ''}</span>
        <button className="navbar__logout" onClick={logout} aria-label="Cerrar sesión">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
