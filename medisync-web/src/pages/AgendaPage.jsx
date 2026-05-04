import React, { useState } from 'react';
import AgendaView from '../components/appointments/AgendaView';
import CreateAppointmentForm from '../components/appointments/CreateAppointmentForm';
import EditAppointmentForm from '../components/appointments/EditAppointmentForm';
import CancelAppointmentModal from '../components/appointments/CancelAppointmentModal';
import Card from '../components/common/Card';

const AgendaPage = () => {
  const [view, setView] = useState('agenda'); // 'agenda' | 'create' | 'edit' | 'cancel'
  const [selectedCita, setSelectedCita] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setView('agenda');
    setSelectedCita(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <div>
      <h1 className="page-title">Agenda</h1>

      {view === 'agenda' && (
        <Card>
          <AgendaView
            key={refreshKey}
            onNew={() => setView('create')}
            onEdit={(cita) => { setSelectedCita(cita); setView('edit'); }}
            onCancel={(cita) => { setSelectedCita(cita); setView('cancel'); }}
          />
        </Card>
      )}

      {view === 'create' && (
        <Card>
          <CreateAppointmentForm onSuccess={refresh} onCancel={() => setView('agenda')} />
        </Card>
      )}

      {view === 'edit' && selectedCita && (
        <Card>
          <EditAppointmentForm cita={selectedCita} onSuccess={refresh} onCancel={() => setView('agenda')} />
        </Card>
      )}

      {view === 'cancel' && selectedCita && (
        <CancelAppointmentModal cita={selectedCita} onSuccess={refresh} onClose={() => setView('agenda')} />
      )}
    </div>
  );
};

export default AgendaPage;
