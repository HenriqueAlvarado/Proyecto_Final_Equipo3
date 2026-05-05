import React, { useEffect, useState } from 'react';
import { getMisCitas } from '../services/authService';
import { formatDate, formatTime } from '../utils/formatters';
import Card from '../components/common/Card';

const STATUS = {
  programada: { label: 'Programada', color: '#1a73e8', bg: '#e8f0fe' },
  completada: { label: 'Completada', color: '#34a853', bg: '#e6f4ea' },
  cancelada:  { label: 'Cancelada',  color: '#ea4335', bg: '#fce8e6' },
};

const MisCitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMisCitas()
      .then(setCitas)
      .catch(() => setError('No se pudieron cargar tus citas'))
      .finally(() => setLoading(false));
  }, []);

  const proximas = citas.filter(c => c.estado === 'programada');
  const pasadas  = citas.filter(c => c.estado !== 'programada');

  return (
    <div>
      <h1 className="page-title">Mis citas</h1>

      {loading && <p style={{ color: 'var(--color-gray-500)' }}>Cargando tus citas...</p>}
      {error   && <p style={{ color: 'var(--color-danger)' }} role="alert">{error}</p>}

      {!loading && !error && citas.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <p>No tienes citas registradas.</p>
          </div>
        </Card>
      )}

      {proximas.length > 0 && (
        <Card title="Próximas citas">
          {proximas.map(cita => <CitaCard key={cita.id} cita={cita} />)}
        </Card>
      )}

      {pasadas.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <Card title="Historial">
            {pasadas.map(cita => <CitaCard key={cita.id} cita={cita} />)}
          </Card>
        </div>
      )}
    </div>
  );
};

const CitaCard = ({ cita }) => {
  const status = STATUS[cita.estado] || { label: cita.estado, color: '#666', bg: '#eee' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px', borderBottom: '1px solid var(--color-gray-100)',
    }}>
      <div style={{
        minWidth: '64px', textAlign: 'center',
        background: 'var(--color-gray-100)', borderRadius: '8px', padding: '8px',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
          {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short' })}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)', lineHeight: 1 }}>
          {new Date(cita.fecha + 'T00:00:00').getDate()}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
          Dr. {cita.medico_nombre}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
          {cita.especialidad} · {formatTime(cita.hora)}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: '4px' }}>
          {cita.motivo}
        </div>
      </div>
      <span style={{
        padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
        color: status.color, backgroundColor: status.bg,
      }}>
        {status.label}
      </span>
    </div>
  );
};

export default MisCitasPage;
