import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children, redirectPath = '/', ...rest }) => {
  const { authenticated } = useAuth(); 

  return authenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;












