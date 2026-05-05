import React, { useState } from 'react';
import { deletePatient } from '../../services/patientService';
import Button from '../common/Button';
import './PatientList.css';

const PatientList = ({ patients, onDeleted }) => {
  const [selected, setSelected] = useState(null);       // paciente en detalle
  const [toDelete, setToDelete] = useState(null);       // paciente a eliminar
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoadingId(toDelete.id);
    setError('');
    try {
      await deletePatient(toDelete.id);
      setToDelete(null);
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(err.message || 'Error al eliminar paciente');
    } finally {
      setLoadingId(null);
    }
  };

  if (!patients || patients.length === 0) {
    return <p style={{ color: 'var(--color-gray-500)' }}>No se encontraron pacientes.</p>;
  }

  return (
    <>
      <table className="patient-table" aria-label="Lista de pacientes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.nombre} {p.apellido}</td>
              <td>{p.email || '—'}</td>
              <td>{p.telefono || '—'}</td>
              <td className="patient-table__actions">
                <Button size="sm" variant="outline" onClick={() => setSelected(p)}>
                  Ver detalle
                </Button>
                <Button size="sm" variant="danger" onClick={() => { setToDelete(p); setError(''); }}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalle */}
      {selected && (
        <div className="patient-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detalle-title">
          <div className="patient-modal">
            <h2 id="detalle-title" className="patient-modal__title">
              {selected.nombre} {selected.apellido}
            </h2>
            <div className="patient-modal__grid">
              <div className="patient-modal__field">
                <span className="patient-modal__label">Correo</span>
                <span>{selected.email || '—'}</span>
              </div>
              <div className="patient-modal__field">
                <span className="patient-modal__label">Teléfono</span>
                <span>{selected.telefono || '—'}</span>
              </div>
              <div className="patient-modal__field">
                <span className="patient-modal__label">Fecha de nacimiento</span>
                <span>{selected.fecha_nacimiento
                  ? new Date(selected.fecha_nacimiento + 'T00:00:00').toLocaleDateString('es-MX')
                  : '—'}
                </span>
              </div>
              <div className="patient-modal__field">
                <span className="patient-modal__label">CURP</span>
                <span className="patient-modal__curp">{selected.curp || '—'}</span>
              </div>
              <div className="patient-modal__field patient-modal__field--full">
                <span className="patient-modal__label">Dirección</span>
                <span>{selected.direccion || '—'}</span>
              </div>
            </div>
            <div className="patient-modal__actions">
              <Button onClick={() => setSelected(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {toDelete && (
        <div className="patient-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="patient-modal">
            <h2 id="delete-title" className="patient-modal__title">Eliminar paciente</h2>
            <p style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{toDelete.nombre} {toDelete.apellido}</strong>?
              Esta acción no se puede deshacer.
            </p>
            {error && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '12px' }} role="alert">
                {error}
              </p>
            )}
            <div className="patient-modal__actions">
              <Button variant="danger" onClick={handleDelete} loading={loadingId === toDelete.id}>
                Sí, eliminar
              </Button>
              <Button variant="outline" onClick={() => { setToDelete(null); setError(''); }}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientList;
