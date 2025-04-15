
/**
 * Hook for real-time canvas synchronization
 * Handles sending and receiving canvas updates via Pusher
 * @module hooks/useRealtimeCanvasSync
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  subscribeSyncChannel, 
  broadcastFloorPlanUpdate, 
  isUpdateFromThisDevice,
  UPDATE_EVENT
} from '@/utils/syncService';

interface UseRealtimeCanvasSyncProps {
  /**
   * The Fabric canvas instance
   */
  canvas: FabricCanvas | null;
  
  /**
   * Enable/disable syncing
   */
  enabled: boolean;
  
  /**
   * Optional callback when remote update is received
   */
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
  
  /**
   * Throttle time for sending updates (ms)
   */
  throttleTime?: number;
}

/**
 * Hook for real-time canvas synchronization via Pusher
 */
export const useRealtimeCanvasSync = ({
  canvas,
  enabled = true,
  onRemoteUpdate,
  throttleTime = 1500 // Default throttle time
}: UseRealtimeCanvasSyncProps) => {
  // Reference to track last sync time
  const lastSyncTimeRef = useRef<number>(0);
  const pendingSyncTimeoutRef = useRef<number | null>(null);
  
  // Get user information for attribution
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const userName = user?.name || user?.email || 'Anonymous User';
  
  // Track connected collaborators
  const [collaborators, setCollaborators] = useState<number>(0);
  
  // Track sync status
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Manually sync canvas (exports current state and broadcasts)
  const syncCanvas = () => {
    if (!canvas || !enabled) return false;
    
    try {
      setIsSyncing(true);
      
      // Create a timestamp for this sync
      const syncTimestamp = Date.now();
      
      // Export canvas as JSON
      const canvasJson = JSON.stringify(canvas.toJSON(['id', 'selectable']));
      
      // Create floor plan data for sync
      const floorPlanData = [{
        id: 'current-canvas',
        name: 'Shared Canvas',
        canvasJson,
        updatedAt: new Date().toISOString(),
        metadata: {
          syncedBy: userName,
          syncTimestamp
        }
      }];
      
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
  
  // Throttled sync function
  const throttledSync = () => {
    // Clear any pending sync timeout
    if (pendingSyncTimeoutRef.current !== null) {
      window.clearTimeout(pendingSyncTimeoutRef.current);
      pendingSyncTimeoutRef.current = null;
    }
    
    // Check if we should throttle
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTimeRef.current;
    
    if (timeSinceLastSync < throttleTime) {
      // Schedule a sync for later
      pendingSyncTimeoutRef.current = window.setTimeout(() => {
        syncCanvas();
        pendingSyncTimeoutRef.current = null;
      }, throttleTime - timeSinceLastSync);
    } else {
      // Sync immediately
      syncCanvas();
    }
  };
  
  // Set up Pusher subscription for real-time sync
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Subscribe to sync channel
    const channel = subscribeSyncChannel();
    let firstSync = true;
    
    // Handle remote canvas updates
    channel.bind(`client-${UPDATE_EVENT}`, (data: any) => {
      // Skip if this is our own update
      if (isUpdateFromThisDevice(data.deviceId)) {
        return;
      }
      
      try {
        // Extract data
        const remoteFloorPlans = data.floorPlans;
        const remoteTimestamp = data.timestamp || Date.now();
        const remoteSender = data.userId || 'unknown';
        
        // Skip if we don't have valid floor plans
        if (!remoteFloorPlans || remoteFloorPlans.length === 0) return;
        
        // Get canvas data
        const remoteCanvasJson = remoteFloorPlans[0].canvasJson;
        if (!remoteCanvasJson) return;
        
        // Skip if this is an older update than our last sync
        if (remoteTimestamp < lastSyncTimeRef.current) {
          console.log('Skipping older update:', remoteTimestamp, '<', lastSyncTimeRef.current);
          return;
        }
        
        // Track for sender attribution
        const senderName = remoteFloorPlans[0]?.metadata?.syncedBy || 'Another user';
        
        // Remember current viewport and selection
        const currentZoom = canvas.getZoom();
        // Store the current viewportTransform as a new array to avoid reference issues
        const currentViewport = canvas.viewportTransform ? [...canvas.viewportTransform] : undefined;
        const activeObject = canvas.getActiveObject();
        
        // Load remote canvas data
        canvas.loadFromJSON(JSON.parse(remoteCanvasJson), () => {
          // Restore viewport position and zoom if available
          if (currentViewport && canvas.viewportTransform) {
            // Make sure we create a proper copy with the correct length
            canvas.viewportTransform[0] = currentViewport[0];
            canvas.viewportTransform[1] = currentViewport[1];
            canvas.viewportTransform[2] = currentViewport[2];
            canvas.viewportTransform[3] = currentViewport[3];
            canvas.viewportTransform[4] = currentViewport[4];
            canvas.viewportTransform[5] = currentViewport[5];
            canvas.setZoom(currentZoom);
          }
          
          // Render the updated canvas
          canvas.renderAll();
          
          // Update last sync time
          lastSyncTimeRef.current = remoteTimestamp;
          setLastSyncTime(remoteTimestamp);
          
          // Call the remote update callback
          if (onRemoteUpdate) {
            onRemoteUpdate(remoteSender, remoteTimestamp);
          }
          
          // Show a toast notification for the first update only or if it's been a while
          if (firstSync || (remoteTimestamp - lastSyncTimeRef.current > 15000)) {
            toast.info(`Canvas updated by ${senderName}`);
            firstSync = false;
          }
        });
      } catch (error) {
        console.error('Error applying remote canvas update:', error);
      }
    });
    
    // Handle presence events to track collaborators
    channel.bind(`client-presence-update`, (data: any) => {
      // Skip if this is our own update
      if (isUpdateFromThisDevice(data.deviceId)) {
        return;
      }
      
      // Update collaborator count
      if (data && typeof data.count === 'number') {
        setCollaborators(Math.max(0, data.count - 1)); // Subtract self
      }
    });
    
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
        channel.unbind(`client-${UPDATE_EVENT}`);
        channel.unbind('client-presence-update');
        
        // Clear any pending sync timeout
        if (pendingSyncTimeoutRef.current !== null) {
          window.clearTimeout(pendingSyncTimeoutRef.current);
          pendingSyncTimeoutRef.current = null;
        }
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
