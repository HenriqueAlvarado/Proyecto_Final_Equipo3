import React, { useEffect, useState } from 'react';
import { getPatients, searchPatients } from '../services/patientService';
import PatientList from '../components/patients/PatientList';
import PatientSearch from '../components/patients/PatientSearch';
import PatientForm from '../components/patients/PatientForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    getPatients()
      .then(setPatients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleSearch = async (query) => {
    if (!query) {
      setRefreshKey(k => k + 1);
      return;
    }
    const results = await searchPatients(query);
    setPatients(results);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Pacientes</h1>
        <Button onClick={() => setShowForm(true)}>+ Nuevo paciente</Button>
      </div>

      {showForm && (
        <Card>
          <PatientForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      <Card>
        <PatientSearch onSearch={handleSearch} />
        {loading ? <p>Cargando pacientes...</p> : <PatientList patients={patients} onDeleted={() => setRefreshKey(k => k + 1)} />}
      </Card>
    </div>
  );
};

export default PatientsPage;
