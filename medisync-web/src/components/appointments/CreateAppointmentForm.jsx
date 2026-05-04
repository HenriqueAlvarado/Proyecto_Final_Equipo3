import React, { useState, useEffect } from 'react';
import { createAppointment } from '../../services/appointmentService';
import { getDoctors } from '../../services/doctorService';
import { searchPatients } from '../../services/patientService';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateAppointmentForm = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    paciente_id: '',
    medico_id: '',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    getDoctors().then(setMedicos).catch(() => {});
  }, []);

  useEffect(() => {
    if (busqueda.length >= 2) {
      searchPatients(busqueda).then(setPacientes).catch(() => {});
    }
  }, [busqueda]);

  const validate = () => {
    const e = {};
    if (!form.paciente_id) e.paciente_id = 'Selecciona un paciente';
    if (!form.medico_id) e.medico_id = 'Selecciona un médico';
    if (!form.fecha) e.fecha = 'La fecha es requerida';
    if (!form.hora) e.hora = 'La hora es requerida';
    if (!form.motivo) e.motivo = 'El motivo es requerido';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await createAppointment(form);
      onSuccess();
    } catch (err) {
      setErrors({ general: err.message || 'Error al crear la cita' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Nueva cita</h2>

      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

      <div>
        <Input
          id="busqueda"
          label="Buscar paciente"
          placeholder="Nombre o CURP..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {pacientes.length > 0 && (
          <select
            name="paciente_id"
            value={form.paciente_id}
            onChange={handleChange}
            aria-label="Seleccionar paciente"
          >
            <option value="">-- Selecciona --</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>
        )}
        {errors.paciente_id && <span style={{ color: 'red' }}>{errors.paciente_id}</span>}
      </div>

      <div>
        <label htmlFor="medico_id">Médico</label>
        <select id="medico_id" name="medico_id" value={form.medico_id} onChange={handleChange}>
          <option value="">-- Selecciona --</option>
          {medicos.map(m => (
            <option key={m.id} value={m.id}>{m.nombre} - {m.especialidad}</option>
          ))}
        </select>
        {errors.medico_id && <span style={{ color: 'red' }}>{errors.medico_id}</span>}
      </div>

      <Input id="fecha" name="fecha" type="date" label="Fecha" value={form.fecha} onChange={handleChange} error={errors.fecha} required />
      <Input id="hora" name="hora" type="time" label="Hora" value={form.hora} onChange={handleChange} error={errors.hora} required />
      <Input id="motivo" name="motivo" label="Motivo" placeholder="Motivo de la consulta" value={form.motivo} onChange={handleChange} error={errors.motivo} required />

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button type="submit" loading={loading}>Crear cita</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

export default CreateAppointmentForm;
