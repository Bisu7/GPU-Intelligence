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
import TeamsPage from './pages/TeamsPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import APIKeysPage from './pages/APIKeysPage';
import BillingPage from './pages/BillingPage';

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
          <Route path="teams" element={<TeamsPage />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="alerts" element={<AlertsCenter />} />
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="api-keys" element={<APIKeysPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="gpus/:id" element={<GPUDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
