import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, DashboardPage, GitHubCallbackPage } from '../features/auth/pages';
import { TravelRequestListPage, TravelRequestFormPage } from '../features/travel-requests/pages';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* GitHub OAuth Callback Route */}
      <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas de Solicitudes de Viaje */}
      <Route
        path="/travel-requests"
        element={
          <ProtectedRoute>
            <TravelRequestListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/travel-requests/new"
        element={
          <ProtectedRoute>
            <TravelRequestFormPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
