
/**
 * Hook for managing offline support
 * @module hooks/useOfflineSupport
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { saveCanvasToIDB, loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';

interface UseOfflineSupportOptions {
  canvasId?: string;
  onReconnect?: () => Promise<void>;
  showToasts?: boolean;
}

/**
 * Hook that provides offline detection and management with cloud sync
 * @returns Object with online status and utilities
 */
export const useOfflineSupport = (options?: UseOfflineSupportOptions) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const reconnectAttemptRef = useRef(false);
  const syncProgressRef = useRef(false);
  const { canvasId = 'default-canvas', onReconnect, showToasts = true } = options || {};
  
  // Sync local canvas data to Supabase when coming back online
  const syncToCloud = useCallback(async () => {
    if (syncProgressRef.current) return;
    
    try {
      syncProgressRef.current = true;
      logger.info('Attempting to sync canvas data to cloud');
      
      // Load local canvas data from IndexedDB
      const canvasData = await loadCanvasFromIDB(canvasId);
      if (!canvasData) {
        logger.info('No local canvas data to sync');
        return;
      }
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.info('User not authenticated, skipping cloud sync');
        return;
      }
      
      // SECURITY FIX: For now, we'll disable the direct Supabase table access
      // until proper RLS policies are in place. This prevents unauthorized access.
      /*
      // The following code is commented out as it requires Row Level Security
      // to be properly configured on the Supabase 'canvas_data' table.
      
      // For proper implementation, these RLS policies should be established:
      // CREATE POLICY "Users can access their own canvas data" ON canvas_data
      //   FOR ALL USING (auth.uid() = user_id);
      
      const { error } = await supabase
        .from('canvas_data') // This table must be created with RLS
        .upsert({
          user_id: user.id,  
          canvas_id: canvasId,
          data: canvasData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,canvas_id' });
      
      if (error) {
        throw error;
      }
      */
      
      // Log info about what would have happened
      logger.info('Canvas data would be synced to cloud (table requires RLS)');
      
      if (showToasts) {
        toast.success('Your work has been saved locally (cloud sync disabled)');
      }
      
      logger.info('Successfully handled canvas data sync');
    } catch (error) {
      handleError(error, 'error', {
        component: 'useOfflineSupport',
        operation: 'syncToCloud',
        canvasId
      });
      if (showToasts) {
        toast.error('Failed to sync your work');
      }
    } finally {
      syncProgressRef.current = false;
    }
  }, [canvasId, showToasts]);
  
  // Handle online event
  const handleOnline = useCallback(async () => {
    logger.info('Application is online');
    setIsOnline(true);
    
    if (wasOffline) {
      if (showToasts) {
        toast.success('You\'re back online! Syncing your changes...');
      }
      
      setWasOffline(false);
      
      // Attempt to sync with server
      await syncToCloud();
      
      // Run custom reconnect handler if provided
      if (onReconnect && !reconnectAttemptRef.current) {
        reconnectAttemptRef.current = true;
        
        try {
          await onReconnect();
          logger.info('Reconnect handler executed successfully');
        } catch (error) {
          handleError(error, 'error', {
            component: 'useOfflineSupport',
            operation: 'onReconnect'
          });
        } finally {
          reconnectAttemptRef.current = false;
        }
      }
    }
  }, [wasOffline, onReconnect, showToasts, syncToCloud]);
  
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
    wasOffline,
    syncToCloud
  };
};
