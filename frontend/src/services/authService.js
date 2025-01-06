import axiosInstance from '../lib/axiosInstance';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    
    // Set the token in the authorization header for subsequent requests
    if (response.data.access_token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    if (error.response?.status === 429) {
      throw new Error('Too many login attempts. Please try again later.');
    }
    throw error;
  }
};

// Add the missing register function
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('User already exists');
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/refresh');
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    return response.data;
  } catch (error) {
    logout();
    throw error;
  }
};