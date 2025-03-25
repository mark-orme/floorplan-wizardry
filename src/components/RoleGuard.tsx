
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth' 
}: RoleGuardProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
