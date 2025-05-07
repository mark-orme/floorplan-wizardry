
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthContextWithRole {
  user: any;
  userRole?: string; // Make userRole optional
}

/**
 * Base hook for property operations
 * Provides common functionality for property hooks
 */
export const usePropertyBase = () => {
  const { user, userRole } = useAuth() as AuthContextWithRole;
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
    userRole, // This can be undefined now
    isLoading,
    setIsLoading,
    checkAuthentication
  };
};
