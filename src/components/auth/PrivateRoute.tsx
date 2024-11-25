import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  element, 
  allowedRoles = [] 
}) => {
  const location = useLocation();
  const { user, token } = useSelector((state: RootState) => state.loginIn);

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role.toLowerCase())) {
    // Redirect based on user role
    if (user.role.toLowerCase() === 'artist') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role.toLowerCase() === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};