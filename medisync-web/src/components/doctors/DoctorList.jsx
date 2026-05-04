import React from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

const DoctorList = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return <p style={{ color: 'var(--color-gray-500)' }}>No hay médicos registrados.</p>;
  }

  return (
    <div className="doctor-list">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
