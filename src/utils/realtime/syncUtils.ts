
/**
 * Real-time synchronization utilities
 * Functions for canvas sync operations
 */
import { Canvas as FabricCanvas } from 'fabric';
import { subscribeSyncChannel } from '@/utils/syncService';
import { SyncFloorPlan } from './types';
import logger from '@/utils/logger';

/**
 * Set up real-time synchronization for canvas
 * @param canvas - Fabric canvas instance
 * @param lastSyncTimeRef - Reference to the last sync time
 * @param setLastSyncTime - Function to update the last sync time
 * @param setCollaborators - Function to update the collaborator count
 * @param onRemoteUpdate - Optional callback for remote updates
 * @param channelId - Channel identifier (optional)
 * @returns The subscribed channel
 */
export const setupRealtimeSync = (
  canvas: FabricCanvas,
  lastSyncTimeRef: React.MutableRefObject<number>,
  setLastSyncTime: React.Dispatch<React.SetStateAction<number>>,
  setCollaborators: React.Dispatch<React.SetStateAction<number>>,
  onRemoteUpdate?: (sender: string, timestamp: number) => void,
  channelId: string = 'default'
) => {
  // Subscribe to the sync channel
  const channel = subscribeSyncChannel(channelId);
  
  // Set up listeners for real-time updates
  if (channel) {
    // Handle canvas updates
    channel.bind('client-canvas-update', (data: any) => {
      try {
        // Check if this update is newer than our last state
        if (data.timestamp > lastSyncTimeRef.current) {
          logger.info(`Received canvas update from ${data.userId} at ${new Date(data.timestamp).toISOString()}`);
          
          // Apply updates
          applyRemoteUpdates(canvas, data.floorPlans);
          
          // Update our last sync time
          setLastSyncTime(data.timestamp);
          
          // Call callback if provided
          if (onRemoteUpdate) {
            onRemoteUpdate(data.userId, data.timestamp);
          }
        }
      } catch (error) {
        logger.error('Error handling remote canvas update:', error);
      }
    });
    
    // Handle presence events
    channel.bind('client-presence-update', (data: any) => {
      setCollaborators(data.count || 1);
      logger.info(`Collaborators: ${data.count || 1}`);
    });
  }
  
  return channel;
};

/**
 * Apply remote updates to local canvas
 * @param canvas - Fabric canvas instance
 * @param floorPlans - Synced floor plan data
 */
const applyRemoteUpdates = (canvas: FabricCanvas, floorPlans: SyncFloorPlan[]) => {
  if (!floorPlans || floorPlans.length === 0) return;
  
  try {
    // Load the first floor plan (for now - can be extended to handle multiple)
    const floorPlan = floorPlans[0];
    
    if (floorPlan.canvasJson) {
      canvas.loadFromJSON(floorPlan.canvasJson, () => {
        canvas.renderAll();
        logger.info('Applied remote canvas update');
      });
    }
  } catch (error) {
    logger.error('Error applying remote updates:', error);
  }
};

/**
 * Create floor plan data for synchronization
 * @param canvas - Fabric canvas instance
 * @param userName - User name or identifier
 * @returns Array of floor plans to sync
 */
export const createFloorPlanDataForSync = (
  canvas: FabricCanvas,
  userName: string
): SyncFloorPlan[] => {
  try {
    // Serialize the canvas to JSON
    const canvasJson = JSON.stringify(canvas.toJSON(['id', 'objectType']));
    
    // Create a floor plan object
    const floorPlan: SyncFloorPlan = {
      id: 'floor-1', // For now, just use a fixed ID
      name: 'Main Floor',
      canvasJson,
      updatedAt: new Date().toISOString(),
      metadata: {
        syncedBy: userName,
        syncTimestamp: Date.now(),
        dimension: {
          width: canvas.width || 800,
          height: canvas.height || 600
        }
      }
    };
    
    return [floorPlan];
  } catch (error) {
    logger.error('Error creating floor plan data for sync:', error);
    return [];
  }
};
