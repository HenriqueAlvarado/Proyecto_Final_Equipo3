import React from 'react';
import Button from '../common/Button';

const PatientList = ({ patients, onSelect }) => {
  if (!patients || patients.length === 0) {
    return <p style={{ color: 'var(--color-gray-500)' }}>No se encontraron pacientes.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Lista de pacientes">
      <thead>
        <tr style={{ backgroundColor: 'var(--color-gray-100)' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Correo</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(p => (
          <tr key={p.id} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
            <td style={{ padding: '12px' }}>{p.nombre} {p.apellido}</td>
            <td style={{ padding: '12px' }}>{p.email}</td>
            <td style={{ padding: '12px' }}>{p.telefono}</td>
            <td style={{ padding: '12px' }}>
              <Button size="sm" variant="outline" onClick={() => onSelect(p)}>Ver detalle</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientList;
