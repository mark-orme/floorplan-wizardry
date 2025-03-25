
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallbackElement?: ReactNode; // New prop for fallback content
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth',
  fallbackElement = null
}: RoleGuardProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-2">Loading...</span>
    </div>;
  }

  // If fallbackElement is provided, show that to non-authenticated users
  // instead of redirecting
  if (!user && fallbackElement) {
    return <>{fallbackElement}</>;
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/properties" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
