import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { token, user }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getUsuarios = async () => {
  const response = await api.get('/auth/usuarios');
  return response.data;
};

export const toggleUsuario = async (id) => {
  const response = await api.patch(`/auth/usuarios/${id}/toggle`);
  return response.data;
};

export const loginPaciente = async (email, password) => {
  const response = await api.post('/auth/login-paciente', { email, password });
  return response.data; // { token, user }
};

export const getMisCitas = async () => {
  const response = await api.get('/auth/mis-citas');
  return response.data;
};
