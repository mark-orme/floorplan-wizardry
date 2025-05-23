
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Enhanced error handling helper
const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'An unknown error occurred';
  }
};

interface UseOfflineSupportOptions {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSyncRequired?: () => void;
  autoSync?: boolean;
  syncInterval?: number;
  showToasts?: boolean;
}

/**
 * Hook to handle offline support and sync capabilities
 */
export const useOfflineSupport = ({
  onConnected,
  onDisconnected,
  onSyncRequired,
  autoSync = true,
  syncInterval = 30000, // 30 seconds
  showToasts = true
}: UseOfflineSupportOptions = {}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncPending, setSyncPending] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Handle online status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) {
        toast.success('You are back online');
      }
      onConnected?.();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        toast.warning('You are offline. Changes will be saved locally.');
      }
      onDisconnected?.();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onConnected, onDisconnected, showToasts]);
  
  // Sync data with server
  const syncData = useCallback(async () => {
    if (!isOnline) {
      setSyncPending(true);
      return false;
    }
    
    try {
      setSyncError(null);
      // Simulate sync with server
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastSyncTime(new Date());
      setSyncPending(false);
      
      if (showToasts) {
        toast.success('Data synchronized with server');
      }
      
      return true;
    } catch (error) {
      setSyncError(formatErrorMessage(error));
      
      if (showToasts) {
        toast.error(formatErrorMessage(error));
      }
      
      return false;
    }
  }, [isOnline, showToasts]);
  
  // Perform automatic sync when back online
  useEffect(() => {
    if (isOnline && syncPending && autoSync) {
      syncData()
        .catch(error => {
          console.error('Automatic sync failed:', formatErrorMessage(error));
          if (showToasts) {
            toast.error(formatErrorMessage(error));
          }
        });
    }
  }, [isOnline, syncPending, autoSync, syncData, showToasts]);
  
  // Periodically sync if online and autoSync enabled
  useEffect(() => {
    if (!autoSync || !isOnline) return;
    
    const intervalId = setInterval(() => {
      syncData()
        .catch(error => {
          console.error('Periodic sync failed:', formatErrorMessage(error));
          if (showToasts) {
            toast.error(formatErrorMessage(error));
          }
        });
    }, syncInterval);
    
    return () => clearInterval(intervalId);
  }, [autoSync, isOnline, syncInterval, syncData, showToasts]);
  
  return {
    isOnline,
    syncPending,
    lastSyncTime,
    syncError,
    syncData,
    setSyncPending
  };
};

export default useOfflineSupport;
