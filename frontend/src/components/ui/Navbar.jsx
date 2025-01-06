import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">Status Page</Link>
            <Link to="/status" className="hover:text-gray-300">Public Status</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/services" className="hover:text-gray-300">Services</Link>
                <Link to="/incidents" className="hover:text-gray-300">Incidents</Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;