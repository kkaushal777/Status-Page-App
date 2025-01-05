import axiosInstance from '../lib/axiosInstance';

export const getAllServices = async () => {
  const response = await axiosInstance.get('/services');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axiosInstance.post('/services', serviceData);
  return response.data;
};

export const getServiceDetails = async (serviceId) => {
  const response = await axiosInstance.get(`/services/${serviceId}`);
  return response.data;
};

export const updateService = async (serviceId, serviceData) => {
  const response = await axiosInstance.put(`/services/${serviceId}`, serviceData);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await axiosInstance.delete(`/services/${serviceId}`);
  return response.data;
};