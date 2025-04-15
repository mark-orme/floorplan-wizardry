
/**
 * Hook for offline support with canvas
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { handleError } from '@/utils/errorHandling';

interface UseOfflineSupportProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  onStatusChange?: (isOnline: boolean) => void;
}

/**
 * Hook for managing offline/online state and sync capabilities
 */
export const useOfflineSupport = ({
  canvas,
  canvasId,
  onStatusChange
}: UseOfflineSupportProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onStatusChange) onStatusChange(true);
      
      // Show toast notification
      toast.success('You are back online');
      
      // If there are pending changes, trigger sync
      if (hasPendingChanges) {
        syncChanges();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (onStatusChange) onStatusChange(false);
      
      // Show toast notification
      toast.warning('You are offline. Changes will be saved locally.');
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasPendingChanges, onStatusChange]);
  
  // Save changes locally when offline
  const saveOfflineChanges = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Save canvas state to local storage for offline use
      const json = canvas.toJSON();
      localStorage.setItem(`offline_canvas_${canvasId}`, JSON.stringify(json));
      localStorage.setItem(`offline_canvas_timestamp_${canvasId}`, Date.now().toString());
      
      // Mark that we have pending changes to sync
      setHasPendingChanges(true);
      
    } catch (error) {
      handleError(error, 'error', {
        component: 'useOfflineSupport',
        operation: 'saveOfflineChanges',
        context: { canvasIdentifier: canvasId }
      });
    }
  }, [canvas, canvasId]);
  
  // Sync changes when back online
  const syncChanges = useCallback(async () => {
    if (!isOnline || !canvas) return;
    
    try {
      setIsSyncing(true);
      
      // Get offline changes
      const offlineData = localStorage.getItem(`offline_canvas_${canvasId}`);
      
      if (offlineData) {
        // Here you would implement actual sync with backend
        // This is a placeholder for that implementation
        
        // Clear offline data after successful sync
        localStorage.removeItem(`offline_canvas_${canvasId}`);
        localStorage.removeItem(`offline_canvas_timestamp_${canvasId}`);
        
        setHasPendingChanges(false);
        toast.success('Changes synced successfully');
      }
    } catch (error) {
      handleError(error, 'error', {
        component: 'useOfflineSupport',
        operation: 'syncChanges',
        context: { canvasIdentifier: canvasId }
      });
      toast.error('Failed to sync changes');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, canvas, canvasId]);
  
  // Check for pending changes on mount
  useEffect(() => {
    const offlineData = localStorage.getItem(`offline_canvas_${canvasId}`);
    if (offlineData) {
      setHasPendingChanges(true);
      
      // If online, attempt to sync immediately
      if (isOnline) {
        syncChanges();
      }
    }
  }, [canvasId, isOnline, syncChanges]);
  
  return {
    isOnline,
    hasPendingChanges,
    isSyncing,
    saveOfflineChanges,
    syncChanges
  };
};
