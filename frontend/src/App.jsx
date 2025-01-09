import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ServicePage from '@/pages/ServicePage';
import IncidentPage from '@/pages/IncidentPage';
import StatusPage from '@/pages/StatusPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<StatusPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/status" element={<StatusPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/incidents" element={<IncidentPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;