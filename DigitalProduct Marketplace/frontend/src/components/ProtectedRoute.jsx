import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    // If they aren't an admin, send them home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;