import axiosInstance from '../lib/axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/register', userData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post('/refresh');
  return response.data;
};