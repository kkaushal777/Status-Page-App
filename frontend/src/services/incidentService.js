import axiosInstance from '../lib/axiosInstance';

export const getAllIncidents = async () => {
  const response = await axiosInstance.get('/incidents');
  return response.data;
};

export const createIncident = async (incidentData) => {
  const response = await axiosInstance.post('/incidents', incidentData);
  return response.data;
};

export const getIncidentDetails = async (incidentId) => {
  const response = await axiosInstance.get(`/incidents/${incidentId}`);
  return response.data;
};

export const updateIncident = async (incidentId, incidentData) => {
  const response = await axiosInstance.put(`/incidents/${incidentId}`, incidentData);
  return response.data;
};

export const deleteIncident = async (incidentId) => {
  const response = await axiosInstance.delete(`/incidents/${incidentId}`);
  return response.data;
};

export const getIncidentsByService = async (serviceId) => {
  const response = await axiosInstance.get(`/services/${serviceId}/incidents`);
  return response.data;
};