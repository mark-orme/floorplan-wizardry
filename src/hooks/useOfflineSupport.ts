
/**
 * Hook for managing offline support
 * @module hooks/useOfflineSupport
 */
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Hook that provides offline detection and management
 * @returns Object with online status and utilities
 */
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  
  // Handle online event
  const handleOnline = useCallback(() => {
    logger.info('Application is online');
    setIsOnline(true);
    
    if (wasOffline) {
      toast.success('You\'re back online! Your changes have been saved locally.');
      setWasOffline(false);
    }
  }, [wasOffline]);
  
  // Handle offline event
  const handleOffline = useCallback(() => {
    logger.info('Application is offline');
    setIsOnline(false);
    setWasOffline(true);
    toast.info('You\'re offline. Don\'t worry, your drawings will be saved locally.', {
      duration: 5000
    });
  }, []);
  
  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);
  
  return {
    isOnline,
    wasOffline
  };
};
