import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FleetPage from './pages/FleetPage';
import GPUDetail from './pages/GPUDetail';
import AlertsCenter from './pages/AlertsCenter';
import AIInsights from './pages/AIInsights';

import DashboardLayout from './components/DashboardLayout';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="alerts" element={<AlertsCenter />} />
          <Route path="gpus/:id" element={<GPUDetail />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Settings - Coming Soon</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
