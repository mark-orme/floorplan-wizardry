
/**
 * Hook for managing offline support
 * @module hooks/useOfflineSupport
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseOfflineSupportOptions {
  onReconnect?: () => Promise<void>;
  showToasts?: boolean;
}

/**
 * Hook that provides offline detection and management
 * @returns Object with online status and utilities
 */
export const useOfflineSupport = (options?: UseOfflineSupportOptions) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const reconnectAttemptRef = useRef(false);
  const { onReconnect, showToasts = true } = options || {};
  
  // Handle online event
  const handleOnline = useCallback(async () => {
    logger.info('Application is online');
    setIsOnline(true);
    
    if (wasOffline) {
      if (showToasts) {
        toast.success('You\'re back online! Your changes have been saved locally.');
      }
      
      setWasOffline(false);
      
      // Attempt to sync with server if needed
      if (onReconnect && !reconnectAttemptRef.current) {
        reconnectAttemptRef.current = true;
        
        try {
          await onReconnect();
          logger.info('Reconnect handler executed successfully');
        } catch (error) {
          logger.error('Error in reconnect handler:', error);
        } finally {
          reconnectAttemptRef.current = false;
        }
      }
    }
  }, [wasOffline, onReconnect, showToasts]);
  
  // Handle offline event
  const handleOffline = useCallback(() => {
    logger.info('Application is offline');
    setIsOnline(false);
    setWasOffline(true);
    
    if (showToasts) {
      toast.info('You\'re offline. Don\'t worry, your drawings will be saved locally.', {
        duration: 5000
      });
    }
  }, [showToasts]);
  
  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    if (!navigator.onLine) {
      handleOffline();
    }
    
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
