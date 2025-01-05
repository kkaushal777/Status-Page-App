import React, { useState } from 'react';
import { register } from '../services/authService';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [userData, setUserData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(userData);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input 
            type="text" 
            name="username" 
            value={userData.username} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={userData.password} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <Button className="w-full">Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;