
/**
 * Synchronization service for floor plan data
 * Uses Pusher for real-time data synchronization
 * @module syncService
 */
import { subscribeToChannel, getPusher } from './pusher';
import logger from './logger';
import { FloorPlan } from '@/types/floorPlanTypes';

// Constants
const SYNC_CHANNEL = 'floorplan-sync';
const SAVE_EVENT = 'save-floorplan';
const UPDATE_EVENT = 'update-floorplan';

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
  return subscribeToChannel(SYNC_CHANNEL);
};

/**
 * Broadcast floor plan update to all connected devices
 * Sends the updated floor plans to other devices via Pusher
 * 
 * @param {FloorPlan[]} floorPlans - The updated floor plans to broadcast
 */
export const broadcastFloorPlanUpdate = (floorPlans: FloorPlan[]) => {
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
        });
      }, 1000);
    }
  } catch (error) {
    logger.error('Error broadcasting floor plan update:', error);
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
  SYNC_CHANNEL,
  UPDATE_EVENT
};
