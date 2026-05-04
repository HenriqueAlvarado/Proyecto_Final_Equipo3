import React, { useEffect, useState } from 'react';
import { getUsuarios, toggleUsuario } from '../services/authService';
import UserForm from '../components/users/UserForm';
import UserList from '../components/users/UserList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsuarios();
      setUsers(data);
    } catch {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    setLoadingId(id);
    try {
      const updated = await toggleUsuario(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, activo: updated.activo } : u));
      setSuccessMsg(`Usuario ${updated.activo ? 'activado' : 'desactivado'} correctamente`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSuccessMsg('Usuario creado exitosamente');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchUsers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestión de usuarios</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Nuevo usuario</Button>
        )}
      </div>

      {successMsg && (
        <div style={{
          background: '#e6f4ea', color: 'var(--color-secondary)',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
          borderLeft: '3px solid var(--color-secondary)', fontSize: '0.875rem'
        }} role="status">
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{
          background: '#fce8e6', color: 'var(--color-danger)',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
          borderLeft: '3px solid var(--color-danger)', fontSize: '0.875rem'
        }} role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <UserForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      <Card>
        {loading
          ? <p style={{ color: 'var(--color-gray-500)' }}>Cargando usuarios...</p>
          : <UserList users={users} onToggle={handleToggle} loadingId={loadingId} />
        }
      </Card>
    </div>
  );
};

export default UsersPage;
