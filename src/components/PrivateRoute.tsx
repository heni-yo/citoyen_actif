import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface PrivateRouteProps extends RouteProps {
  requiredRole?: UserRole;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children, ...rest }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest}>{children}</Route>;
};

export default PrivateRoute;

