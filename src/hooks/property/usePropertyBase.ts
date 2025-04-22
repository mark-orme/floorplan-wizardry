
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Base hook for property operations
 * Provides common functionality for property hooks
 */
export const usePropertyBase = () => {
  const { user, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const checkAuthentication = (): boolean => {
    if (!user) {
      toast.error('User must be authenticated');
      return false;
    }
    return true;
  };
  
  return {
    user,
    userRole,
    isLoading,
    setIsLoading,
    checkAuthentication
  };
};
