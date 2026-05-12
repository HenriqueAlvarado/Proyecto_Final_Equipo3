import React, { useState, useMemo } from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

const DoctorList = ({ doctors }) => {
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');

  // Obtener especialidades únicas para el select
  const especialidades = useMemo(() => {
    if (!doctors) return [];
    const unicas = [...new Set(doctors.map(d => d.especialidad).filter(Boolean))];
    return unicas.sort();
  }, [doctors]);

  // Filtrar médicos según especialidad seleccionada
  const doctoresFiltrados = useMemo(() => {
    if (!doctors) return [];
    if (!filtroEspecialidad) return doctors;
    return doctors.filter(d => d.especialidad === filtroEspecialidad);
  }, [doctors, filtroEspecialidad]);

  if (!doctors || doctors.length === 0) {
    return <p style={{ color: 'var(--color-gray-500)' }}>No hay médicos registrados.</p>;
  }

  return (
    <div>
      <div className="doctor-list-filtro">
        <select
          value={filtroEspecialidad}
          onChange={e => setFiltroEspecialidad(e.target.value)}
          className="doctor-list-select"
          aria-label="Filtrar por especialidad"
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map(esp => (
            <option key={esp} value={esp}>{esp}</option>
          ))}
        </select>
        {filtroEspecialidad && (
          <span className="doctor-list-count">
            {doctoresFiltrados.length} médico{doctoresFiltrados.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {doctoresFiltrados.length === 0 ? (
        <p style={{ color: 'var(--color-gray-500)' }}>
          No hay médicos con la especialidad seleccionada.
        </p>
      ) : (
        <div className="doctor-list">
          {doctoresFiltrados.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
