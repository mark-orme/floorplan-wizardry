
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  path: string;
}

export const PrivateRoute = ({ children, path }: PrivateRouteProps) => {
  const auth = useAuth();
  
  // Use optional chaining and nullish coalescing for safe property access
  const isAuthenticated = auth?.user?.isAuthenticated ?? false;
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo(path)} replace />;
  }
  
  return <Route path={path} element={<>{children}</>} />;
};

const redirectTo = (routePath: string | undefined) => {
  if (!routePath) {
    return '/login'; // Default redirect path
  }
  return `/login?returnTo=${encodeURIComponent(routePath)}`;
};
