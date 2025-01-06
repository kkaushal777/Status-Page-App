import React, { useState } from 'react';
import { login } from '../services/authService';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Please fill in all fields');
      }

      const data = await login(credentials);
      
      if (data && data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        // Store any other relevant user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/services');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input 
              type="email" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;