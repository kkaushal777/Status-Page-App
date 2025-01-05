import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicePage from './pages/ServicePage';
import IncidentPage from './pages/IncidentPage';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="p-4 bg-gray-800 text-white">
          <ul className="flex space-x-4">
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/incidents">Incidents</a></li>
            <li><a href="/status">Status</a></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/incidents" element={<IncidentPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;