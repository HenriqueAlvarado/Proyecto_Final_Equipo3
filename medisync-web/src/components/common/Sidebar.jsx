import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['recepcionista', 'medico', 'director'] },
  { to: '/agenda', label: 'Agenda', icon: '📅', roles: ['recepcionista', 'medico'] },
  { to: '/pacientes', label: 'Pacientes', icon: '👥', roles: ['recepcionista'] },
  { to: '/medicos', label: 'Médicos', icon: '👨‍⚕️', roles: ['recepcionista', 'director'] },
  { to: '/usuarios', label: 'Usuarios', icon: '🔑', roles: ['director'] },
];

const Sidebar = () => {
  const { user } = useAuth();

  const visibleItems = navItems.filter(item =>
    item.roles.includes(user?.rol)
  );

  return (
    <nav className="sidebar" aria-label="Navegación principal">
      <ul className="sidebar__menu" role="list">
        {visibleItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
