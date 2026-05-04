import React, { useEffect, useState } from 'react';
import { getAppointmentsByDate } from '../../services/appointmentService';
import { formatDate, formatTime } from '../../utils/formatters';
import Button from '../common/Button';
import './AgendaView.css';

const STATUS_LABELS = {
  programada: { label: 'Programada', color: 'blue' },
  completada: { label: 'Completada', color: 'green' },
  cancelada: { label: 'Cancelada', color: 'red' },
};

const AgendaView = ({ onEdit, onCancel, onNew }) => {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAppointmentsByDate(fecha);
        setCitas(data);
      } catch {
        setError('No se pudieron cargar las citas');
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, [fecha]);

  return (
    <div className="agenda">
      <div className="agenda__header">
        <div className="agenda__date-picker">
          <label htmlFor="fecha-agenda" className="agenda__date-label">Fecha:</label>
          <input
            id="fecha-agenda"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="agenda__date-input"
          />
        </div>
        <Button onClick={onNew} size="sm">+ Nueva cita</Button>
      </div>

      {loading && <p className="agenda__loading">Cargando citas...</p>}
      {error && <p className="agenda__error" role="alert">{error}</p>}

      {!loading && !error && citas.length === 0 && (
        <p className="agenda__empty">No hay citas para esta fecha.</p>
      )}

      {!loading && citas.length > 0 && (
        <table className="agenda__table" aria-label="Agenda de citas">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => {
              const status = STATUS_LABELS[cita.estado] || { label: cita.estado, color: 'gray' };
              return (
                <tr key={cita.id}>
                  <td>{formatTime(cita.hora)}</td>
                  <td>{cita.paciente_nombre}</td>
                  <td>{cita.medico_nombre}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <span className={`agenda__badge agenda__badge--${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="agenda__actions">
                    {cita.estado === 'programada' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => onEdit(cita)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => onCancel(cita)}>
                          Cancelar
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgendaView;
