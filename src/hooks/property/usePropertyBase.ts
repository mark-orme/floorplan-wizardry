
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Base hook for property management operations
 * Provides shared state and authentication handling
 * @returns {Object} Authentication state and validation helpers
 */
export const usePropertyBase = () => {
  const [authContextError, setAuthContextError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // IMPORTANT: Always call hooks unconditionally at the top level
  const authData = useAuth();
  const { user, userRole } = authData;
  
  /**
   * Check if user has valid authentication
   * @returns {boolean} Indicates if user can perform operations
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
