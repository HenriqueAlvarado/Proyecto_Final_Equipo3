import api from './api';

export const getAppointmentsByDate = async (fecha) => {
  const response = await api.get('/citas', { params: { fecha } });
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await api.post('/citas', data);
  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await api.put(`/citas/${id}`, data);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.patch(`/citas/${id}/cancelar`);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get('/citas/mis-citas');
  return response.data;
};
