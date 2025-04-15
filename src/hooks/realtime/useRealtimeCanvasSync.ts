
/**
 * Hook for real-time canvas synchronization
 * Handles sending and receiving canvas updates via Pusher
 * @module hooks/realtime/useRealtimeCanvasSync
 */
import { useEffect, useRef, useState } from 'react';
import { RealtimeCanvasSyncProps, RealtimeCanvasSyncResult } from '@/utils/realtime/types';
import { useAuth } from '@/contexts/AuthContext';
import { createFloorPlanDataForSync, setupRealtimeSync } from '@/utils/realtime/syncUtils';
import { broadcastFloorPlanUpdate } from '@/utils/syncService';
import { useThrottledSync } from './useThrottledSync';

/**
 * Hook for real-time canvas synchronization via Pusher
 */
export const useRealtimeCanvasSync = ({
  canvas,
  enabled = true,
  onRemoteUpdate,
  throttleTime = 1500 // Default throttle time
}: RealtimeCanvasSyncProps): RealtimeCanvasSyncResult => {
  // Track connected collaborators
  const [collaborators, setCollaborators] = useState<number>(0);
  
  // Track sync status
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Get user information for attribution
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const userName = user?.name || user?.email || 'Anonymous User';
  
  // Manually sync canvas (exports current state and broadcasts)
  const syncCanvas = () => {
    if (!canvas || !enabled) return false;
    
    try {
      setIsSyncing(true);
      
      // Create a timestamp for this sync
      const syncTimestamp = Date.now();
      
      // Create floor plan data for sync
      const floorPlanData = createFloorPlanDataForSync(canvas, userName);
      
      // Broadcast update
      broadcastFloorPlanUpdate(floorPlanData, userId);
      
      // Update last sync time
      lastSyncTimeRef.current = syncTimestamp;
      setLastSyncTime(syncTimestamp);
      
      // Reset syncing state after a short delay
      setTimeout(() => {
        setIsSyncing(false);
      }, 300);
      
      return true;
    } catch (error) {
      console.error('Error syncing canvas:', error);
      setIsSyncing(false);
      return false;
    }
  };
  
  // Set up throttled sync
  const { throttledSync, lastSyncTimeRef, cleanup } = useThrottledSync({
    syncFn: syncCanvas,
    throttleTime,
  });
  
  // Set up Pusher subscription for real-time sync
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Setup realtime sync with the canvas
    const channel = setupRealtimeSync(
      canvas,
      lastSyncTimeRef,
      setLastSyncTime,
      setCollaborators,
      onRemoteUpdate
    );
    
    // Set up canvas change event handlers
    if (canvas) {
      const handleObjectModified = () => {
        throttledSync();
      };
      
      const handlePathCreated = () => {
        throttledSync();
      };
      
      // Register event handlers
      canvas.on('object:modified', handleObjectModified);
      canvas.on('path:created', handlePathCreated);
      
      // Sync initially after a short delay
      setTimeout(() => {
        syncCanvas();
      }, 2000);
      
      // Clean up event handlers
      return () => {
        canvas.off('object:modified', handleObjectModified);
        canvas.off('path:created', handlePathCreated);
        
        // Cleanup throttled sync
        cleanup();
      };
    }
  }, [canvas, enabled, onRemoteUpdate, throttleTime, userId, userName]);
  
  return {
    syncCanvas,
    collaborators,
    lastSyncTime,
    isSyncing
  };
};
