import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import FaultsPage from './pages/FaultsPage';
import MaintenancePage from './pages/MaintenancePage';
import MapViewPage from './pages/MapViewPage';
import PredictionsPage from './pages/PredictionsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/assets" element={
            <ProtectedRoute>
              <AssetsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/faults" element={
            <ProtectedRoute>
              <FaultsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/maintenance" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MAINTENANCE_MANAGER']}>
              <MaintenancePage />
            </ProtectedRoute>
          } />
          
          <Route path="/map" element={
            <ProtectedRoute>
              <MapViewPage />
            </ProtectedRoute>
          } />
          
          <Route path="/predictions" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MAINTENANCE_MANAGER', 'EXECUTIVE']}>
              <PredictionsPage />
            </ProtectedRoute>
          } />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
