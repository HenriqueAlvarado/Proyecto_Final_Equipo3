import React, { useEffect, useState } from 'react';
import { getAppointmentsByDate } from '../../services/appointmentService';
import Card from '../common/Card';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, programadas: 0, completadas: 0, canceladas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    getAppointmentsByDate(today)
      .then(citas => {
        setStats({
          total: citas.length,
          programadas: citas.filter(c => c.estado === 'programada').length,
          completadas: citas.filter(c => c.estado === 'completada').length,
          canceladas: citas.filter(c => c.estado === 'cancelada').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Citas hoy', value: stats.total, color: 'blue', icon: '📅' },
    { label: 'Programadas', value: stats.programadas, color: 'blue', icon: '🕐' },
    { label: 'Completadas', value: stats.completadas, color: 'green', icon: '✅' },
    { label: 'Canceladas', value: stats.canceladas, color: 'red', icon: '❌' },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="dashboard__stats">
          {cards.map(card => (
            <div key={card.label} className={`stat-card stat-card--${card.color}`}>
              <span className="stat-card__icon" aria-hidden="true">{card.icon}</span>
              <div>
                <p className="stat-card__value">{card.value}</p>
                <p className="stat-card__label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
