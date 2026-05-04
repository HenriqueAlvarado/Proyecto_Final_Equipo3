import React, { useState } from 'react';
import { cancelAppointment } from '../../services/appointmentService';
import Button from '../common/Button';
import './CancelAppointmentModal.css';

const CancelAppointmentModal = ({ cita, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await cancelAppointment(cita.id);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al cancelar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <h2 id="modal-title" className="modal__title">Cancelar cita</h2>
        <p className="modal__body">
          ¿Estás seguro de que deseas cancelar la cita de{' '}
          <strong>{cita.paciente_nombre}</strong> con el Dr. {cita.medico_nombre}?
        </p>
        {error && <p className="modal__error" role="alert">{error}</p>}
        <div className="modal__actions">
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            Sí, cancelar
          </Button>
          <Button variant="outline" onClick={onClose}>
            No, volver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
