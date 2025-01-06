import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Make sure this matches your backend URL
  timeout: 5000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;