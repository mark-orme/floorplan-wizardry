
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallbackElement?: ReactNode; // Prop for fallback content
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth',
  fallbackElement = null
}: RoleGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add state to handle potential context issues
  const [contextError, setContextError] = useState(false);
  
  // Use try/catch to handle potential context errors
  let authData = { user: null, userRole: null, loading: true };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    setContextError(true);
  }
  
  const { user, userRole, loading } = authData;

  useEffect(() => {
    // If we had a context error, redirect to a safe route
    if (contextError) {
      console.warn('Auth context was not available, redirecting to /properties');
      navigate('/properties', { replace: true });
      return;
    }

    // If loading, do nothing yet
    if (loading) {
      return;
    }

    // If fallbackElement is provided and user not logged in, don't redirect
    if (!user && fallbackElement) {
      return;
    }

    // Check if user is logged in
    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check if user has required role
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate('/properties', { replace: true });
      return;
    }
  }, [user, userRole, loading, contextError, allowedRoles, navigate, redirectTo, fallbackElement]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If fallbackElement is provided, show that to non-authenticated users
  if (!user && fallbackElement) {
    return <>{fallbackElement}</>;
  }

  // If user has the required role, render children
  if (user && userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // This should not be reached due to the redirects in useEffect
  return null;
};

export default RoleGuard;
