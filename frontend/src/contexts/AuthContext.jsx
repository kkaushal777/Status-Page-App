import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Add this function to verify token
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axiosInstance.get('/api/auth/me'); // Updated endpoint
      setUser(response.data.user);
      setOrganization(response.data.organization);
    } catch (error) {
      console.error('Token verification failed:', error);
      // Only clear auth if it's an authentication error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        setOrganization(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      const { access_token, refresh_token, user: userData, organization } = response.data;
      
      // Set the token in axios instance headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Store tokens in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Update state
      setUser(userData);
      setOrganization(organization);
      
      toast({
        title: "Logged in successfully",
        variant: "default",
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred during login';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
    setOrganization(null);
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      toast({
        title: "Registration successful",
        description: "Please login with your credentials",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred during registration';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add organization management functions
  const updateOrganization = async (orgData) => {
    try {
      const response = await axiosInstance.put(`/api/organizations/${organization.id}`, orgData);
      setOrganization(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const inviteTeamMember = async (email, role) => {
    try {
      const response = await axiosInstance.post(`/api/organizations/${organization.id}/invite`, {
        email,
        role
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        organization,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateOrganization,
        inviteTeamMember
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};