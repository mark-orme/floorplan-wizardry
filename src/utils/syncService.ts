
/**
 * Synchronization service for floor plan data
 * Uses Pusher for real-time data synchronization
 * @module syncService
 */
import { subscribeToChannel, getPusher } from './pusher';
import logger from './logger';
import { toast } from 'sonner';

// Constants
export const SYNC_CHANNEL = 'floorplan-sync';
export const SAVE_EVENT = 'save-floorplan';
export const UPDATE_EVENT = 'update-floorplan';
export const PRESENCE_EVENT = 'presence-update';

/**
 * Generate a unique device ID to identify this client
 * Used to filter out self-originated updates in the sync process
 * 
 * @returns {string} Unique device identifier
 */
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }
  
  return deviceId;
};

// Cache the device ID
const DEVICE_ID = getDeviceId();

/**
 * Subscribe to floor plan sync channel
 * Creates and returns a Pusher channel subscription
 * 
 * @returns {Object} The Pusher channel instance
 */
export const subscribeSyncChannel = () => {
  logger.info('Subscribing to floor plan sync channel');
  const channel = subscribeToChannel(SYNC_CHANNEL);
  
  // Setup presence events
  setTimeout(() => {
    try {
      // Using basic connected user count instead of members property
      const pusherInstance = getPusher();
      // Check if the channel exists and is subscribed
      const connectedUsers = 1; // Default to 1 (self)
      
      if (connectedUsers > 1) {
        toast.info(`${connectedUsers - 1} other ${connectedUsers - 1 === 1 ? 'user' : 'users'} connected`);
        
        // Broadcast presence
        channel.trigger(`client-${PRESENCE_EVENT}`, {
          count: connectedUsers,
          timestamp: Date.now(),
          deviceId: DEVICE_ID,
        });
      }
    } catch (err) {
      logger.error('Error counting connected users:', err);
    }
  }, 1500);
  
  return channel;
};

/**
 * Floor plan type with required properties
 */
interface SyncFloorPlan {
  id: string;
  name: string;
  canvasJson: any;
  updatedAt: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Broadcast floor plan update to all connected devices
 * Sends the updated floor plans to other devices via Pusher
 * 
 * @param {SyncFloorPlan[]} floorPlans - The updated floor plans to broadcast
 * @param {string} userId - Optional user ID for tracking changes by user
 */
export const broadcastFloorPlanUpdate = (floorPlans: SyncFloorPlan[], userId?: string) => {
  logger.info('Broadcasting floor plan update');
  
  // In a real production app, you would send this to your server
  // which would use Pusher server SDK to trigger the event
  
  // For demo purposes, we're using the client events (requires enabling in Pusher dashboard)
  // Format: client-{eventName}
  try {
    const channel = getPusher().channel(SYNC_CHANNEL);
    
    if (channel && channel.subscribed) {
      channel.trigger(`client-${UPDATE_EVENT}`, {
        floorPlans,
        timestamp: Date.now(),
        deviceId: DEVICE_ID,
        userId: userId || 'anonymous',
      });
      logger.info('Floor plan update broadcast successful');
    } else {
      logger.warn('Cannot broadcast update: Channel not subscribed');
      
      // Try subscribing and then sending
      const newChannel = subscribeSyncChannel();
      setTimeout(() => {
        newChannel.trigger(`client-${UPDATE_EVENT}`, {
          floorPlans,
          timestamp: Date.now(),
          deviceId: DEVICE_ID,
          userId: userId || 'anonymous',
        });
      }, 1000);
    }
  } catch (error) {
    logger.error('Error broadcasting floor plan update:', error);
  }
};

/**
 * Notify other users about presence change
 */
export const notifyPresenceChange = () => {
  logger.info('Broadcasting presence update');
  
  try {
    const channel = getPusher().channel(SYNC_CHANNEL);
    
    if (channel && channel.subscribed) {
      // Using a simple count since members isn't available
      const count = 1; // Default to 1 (self)
      
      channel.trigger(`client-${PRESENCE_EVENT}`, {
        count,
        timestamp: Date.now(),
        deviceId: DEVICE_ID,
      });
    }
  } catch (error) {
    logger.error('Error broadcasting presence update:', error);
  }
};

/**
 * Check if an update is from this device
 * Used to prevent processing own updates in sync mechanisms
 * 
 * @param {string} sourceDeviceId - The device ID from the update event
 * @returns {boolean} True if the update is from this device
 */
export const isUpdateFromThisDevice = (sourceDeviceId: string): boolean => {
  return sourceDeviceId === DEVICE_ID;
};

export default {
  subscribeSyncChannel,
  broadcastFloorPlanUpdate,
  isUpdateFromThisDevice,
  notifyPresenceChange,
  SYNC_CHANNEL,
  UPDATE_EVENT,
  PRESENCE_EVENT
};
