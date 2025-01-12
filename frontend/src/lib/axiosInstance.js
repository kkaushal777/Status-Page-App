import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://status-page-backend.onrender.com'
    : 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401/400 errors from auth endpoints
    if (error.config.url.includes('/api/auth/') && 
        (error.response?.status === 401 || error.response?.status === 400)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;