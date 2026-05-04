import React from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const fotoUrl = doctor.foto_url ||
    `https://medisync-fotos-20260501.s3.amazonaws.com/medicos/${doctor.id}.jpg`;

  return (
    <div className="doctor-card">
      <img
        src={fotoUrl}
        alt={`Foto de ${doctor.nombre}`}
        className="doctor-card__photo"
        onError={(e) => { e.target.src = '/placeholder-doctor.png'; }}
      />
      <div className="doctor-card__info">
        <h3 className="doctor-card__name">Dr. {doctor.nombre} {doctor.apellido}</h3>
        <p className="doctor-card__specialty">{doctor.especialidad}</p>
        <p className="doctor-card__email">{doctor.email}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
