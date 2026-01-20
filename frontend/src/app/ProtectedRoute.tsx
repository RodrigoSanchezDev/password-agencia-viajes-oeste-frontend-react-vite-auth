import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasToken } from '../utils/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
