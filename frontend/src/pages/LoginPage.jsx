import React, { useState } from 'react';
import { login } from '../services/authService';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      localStorage.setItem('accessToken', data.access_token);
      navigate('/services');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="text" 
            name="email" 
            value={credentials.email} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <Button className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;