/**
 * Utility functions for real-time canvas synchronization
 */
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { SyncFloorPlan } from './types';
import { subscribeSyncChannel, broadcastFloorPlanUpdate, isUpdateFromThisDevice, UPDATE_EVENT } from '@/utils/syncService';

/**
 * Create floor plan data for syncing
 */
export const createFloorPlanDataForSync = (
  canvas: FabricCanvas,
  userName: string
): SyncFloorPlan[] => {
  // Create a timestamp for this sync
  const syncTimestamp = Date.now();
  
  // Export canvas as JSON
  const canvasJson = JSON.stringify(canvas.toJSON(['id', 'selectable']));
  
  // Create floor plan data for sync
  return [{
    id: 'current-canvas',
    name: 'Shared Canvas',
    canvasJson,
    updatedAt: new Date().toISOString(),
    metadata: {
      syncedBy: userName,
      syncTimestamp
    }
  }];
};

/**
 * Process a remote canvas update
 */
export const applyRemoteCanvasUpdate = (
  canvas: FabricCanvas,
  remoteFloorPlans: SyncFloorPlan[],
  remoteTimestamp: number,
  remoteSender: string,
  lastSyncTime: number,
  firstSyncRef: { current: boolean },
  onRemoteUpdate?: (sender: string, timestamp: number) => void
): number | null => {
  try {
    // Skip if we don't have valid floor plans
    if (!remoteFloorPlans || remoteFloorPlans.length === 0) return null;
    
    // Get canvas data
    const remoteCanvasJson = remoteFloorPlans[0].canvasJson;
    if (!remoteCanvasJson) return null;
    
    // Skip if this is an older update than our last sync
    if (remoteTimestamp < lastSyncTime) {
      console.log('Skipping older update:', remoteTimestamp, '<', lastSyncTime);
      return null;
    }
    
    // Track for sender attribution
    const senderName = remoteFloorPlans[0]?.metadata?.syncedBy || 'Another user';
    
    // Remember current viewport and selection
    const currentZoom = canvas.getZoom();
    // Store the current viewportTransform as a new array to avoid reference issues
    const currentViewport = canvas.viewportTransform ? [...canvas.viewportTransform] : undefined;
    
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
      
      // Call the remote update callback
      if (onRemoteUpdate) {
        onRemoteUpdate(remoteSender, remoteTimestamp);
      }
      
      // Show a toast notification for the first update only or if it's been a while
      if (firstSyncRef.current || (remoteTimestamp - lastSyncTime > 15000)) {
        toast.info(`Canvas updated by ${senderName}`);
        firstSyncRef.current = false;
      }
    });
    
    return remoteTimestamp;
  } catch (error) {
    console.error('Error applying remote canvas update:', error);
    return null;
  }
};

/**
 * Set up Pusher subscription for real-time sync
 */
export const setupRealtimeSync = (
  canvas: FabricCanvas,
  lastSyncTimeRef: React.MutableRefObject<number>,
  setLastSyncTime: (time: number) => void,
  setCollaborators: (count: number) => void,
  onRemoteUpdate?: (sender: string, timestamp: number) => void
) => {
  // Subscribe to sync channel WITHOUT passing any arguments
  const channel = subscribeSyncChannel();
  let firstSync = true;
  const firstSyncRef = { current: firstSync };
  
  // Handle remote canvas updates
  channel.bind(`client-${UPDATE_EVENT}`, (data: any) => {
    // Skip if this is our own update
    if (isUpdateFromThisDevice(data.deviceId)) {
      return;
    }
    
    // Extract data
    const remoteFloorPlans = data.floorPlans;
    const remoteTimestamp = data.timestamp || Date.now();
    const remoteSender = data.userId || 'unknown';
    
    const newTimestamp = applyRemoteCanvasUpdate(
      canvas,
      remoteFloorPlans,
      remoteTimestamp,
      remoteSender,
      lastSyncTimeRef.current,
      firstSyncRef,
      onRemoteUpdate
    );
    
    if (newTimestamp) {
      lastSyncTimeRef.current = newTimestamp;
      setLastSyncTime(newTimestamp);
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
  
  return channel;
};
