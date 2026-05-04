import api from './api';

export const getDoctors = async () => {
  const response = await api.get('/medicos');
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/medicos/${id}`);
  return response.data;
};
