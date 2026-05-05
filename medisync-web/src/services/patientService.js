import api from './api';

export const getPatients = async () => {
  const response = await api.get('/pacientes');
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await api.get('/pacientes/buscar', { params: { q: query } });
  return response.data;
};

export const createPatient = async (data) => {
  const response = await api.post('/pacientes', data);
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await api.get(`/pacientes/${id}`);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/pacientes/${id}`);
  return response.data;
};
