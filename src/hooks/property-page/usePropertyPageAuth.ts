
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

/**
 * Hook for handling authentication state for the property page
 */
export const usePropertyPageAuth = () => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  
  // Get auth context properly - always call hooks at the top level
  const { user, userRole, loading: authLoading } = useAuth();
  const hasAccess = userRole ? [UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER].includes(userRole) : false;
  
  return {
    authState: {
      user,
      userRole,
      loading: authLoading,
      hasAccess
    },
    hasError,
    setHasError,
    navigate
  };
};
