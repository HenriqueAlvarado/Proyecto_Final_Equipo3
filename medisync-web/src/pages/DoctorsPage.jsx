import React, { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorService';
import DoctorList from '../components/doctors/DoctorList';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Médicos</h1>
      {loading ? <p>Cargando médicos...</p> : <DoctorList doctors={doctors} />}
    </div>
  );
};

export default DoctorsPage;
