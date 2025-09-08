import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../Context/Context';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthe, user } = useContext(Context);

  if (!isAuthe || !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user's role is not allowed
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 