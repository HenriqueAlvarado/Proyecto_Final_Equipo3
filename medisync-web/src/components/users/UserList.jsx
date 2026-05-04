import React from 'react';
import Button from '../common/Button';
import './UserList.css';

const ROL_LABELS = {
  director: { label: 'Director', color: 'purple' },
  medico: { label: 'Médico', color: 'blue' },
  recepcionista: { label: 'Recepcionista', color: 'green' },
};

const UserList = ({ users, onToggle, loadingId }) => {
  if (!users || users.length === 0) {
    return <p style={{ color: 'var(--color-gray-500)' }}>No hay usuarios registrados.</p>;
  }

  return (
    <table className="user-table" aria-label="Lista de usuarios">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Especialidad</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => {
          const rol = ROL_LABELS[u.rol] || { label: u.rol, color: 'gray' };
          return (
            <tr key={u.id} className={!u.activo ? 'user-table__row--inactive' : ''}>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.email}</td>
              <td>
                <span className={`user-table__badge user-table__badge--${rol.color}`}>
                  {rol.label}
                </span>
              </td>
              <td>{u.especialidad || '—'}</td>
              <td>
                <span className={`user-table__badge user-table__badge--${u.activo ? 'green' : 'red'}`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <Button
                  size="sm"
                  variant={u.activo ? 'danger' : 'secondary'}
                  onClick={() => onToggle(u.id)}
                  loading={loadingId === u.id}
                >
                  {u.activo ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserList;
