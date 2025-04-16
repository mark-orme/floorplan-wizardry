
/**
 * Sync service for real-time canvas collaboration
 * @module utils/syncService
 */
import { v4 as uuidv4 } from 'uuid';
import { SyncFloorPlan } from './realtime/types';
import logger from './logger';
import { getPusher, subscribeToChannel } from './pusher';

// Constants for channel and event names
export const UPDATE_EVENT = 'canvas-update';
export const PRESENCE_EVENT = 'presence-update';

// Generate a unique device ID for this client session
const deviceId = uuidv4();

/**
 * Check if an update originated from this device
 * @param {string} sourceDeviceId - Device ID from the update
 * @returns {boolean} True if update is from this device
 */
export const isUpdateFromThisDevice = (sourceDeviceId: string): boolean => {
  return sourceDeviceId === deviceId;
};

/**
 * Subscribe to a sync channel
 * @param {string} channelId - Optional channel identifier
 * @returns {any} The channel instance
 */
export const subscribeSyncChannel = (channelId: string = 'default'): any => {
  const channelName = `floor-plan-${channelId}`;
  return subscribeToChannel(channelName);
};

/**
 * Broadcast a floor plan update to all clients
 * @param {SyncFloorPlan[]} floorPlans - Floor plans to sync
 * @param {string} userId - User identifier
 * @param {string} channelId - Optional channel identifier
 * @returns {boolean} Success flag
 */
export const broadcastFloorPlanUpdate = (
  floorPlans: SyncFloorPlan[],
  userId: string,
  channelId: string = 'default'
): boolean => {
  try {
    const pusher = getPusher();
    const channelName = `floor-plan-${channelId}`;
    
    const data = {
      floorPlans,
      userId,
      deviceId,
      timestamp: Date.now()
    };
    
    // Trigger a client event (only works with private/presence channels in production)
    pusher.channel(channelName).trigger(`client-${UPDATE_EVENT}`, data);
    
    return true;
  } catch (error) {
    logger.error('Error broadcasting floor plan update:', error);
    return false;
  }
};

/**
 * Notify other clients about presence change
 * @param {string} channelId - Optional channel identifier
 * @returns {boolean} Success flag
 */
export const notifyPresenceChange = (channelId: string = 'default'): boolean => {
  try {
    const pusher = getPusher();
    const channelName = `floor-plan-${channelId}`;
    
    // Get subscribed users count
    const channel = pusher.channel(channelName);
    const subscribedCount = 1; // Default to 1 (self) - in a real implementation, get actual count
    
    const data = {
      userId: 'user', // In a real implementation, get from auth
      deviceId,
      count: subscribedCount,
      timestamp: Date.now()
    };
    
    // Trigger a client event
    channel.trigger(`client-${PRESENCE_EVENT}`, data);
    
    return true;
  } catch (error) {
    logger.error('Error notifying presence change:', error);
    return false;
  }
};

/**
 * Disconnect from all sync channels
 */
export const disconnectAllSyncChannels = (): void => {
  try {
    const pusher = getPusher();
    pusher.disconnect();
    logger.info('Disconnected from all sync channels');
  } catch (error) {
    logger.error('Error disconnecting from sync channels:', error);
  }
};
