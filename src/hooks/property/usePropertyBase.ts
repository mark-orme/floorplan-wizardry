
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Base hook for property management operations
 * Provides shared state and authentication handling
 */
export const usePropertyBase = () => {
  const [authContextError, setAuthContextError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  let authData = { user: null, userRole: null };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error in property management:', error);
    setAuthContextError(true);
  }
  
  const { user, userRole } = authData;
  
  /**
   * Check if user has valid authentication
   * @returns boolean indicating if user can perform operations
   */
  const checkAuthentication = () => {
    if (authContextError) {
      toast.error('Authentication error. Please refresh the page and try again.');
      return false;
    }
    
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return false;
    }
    
    return true;
  };
  
  return {
    user,
    userRole,
    isLoading,
    setIsLoading,
    authContextError,
    checkAuthentication
  };
};
