
/**
 * Sync service for real-time canvas collaboration
 * @module utils/syncService
 */
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

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
 * Basic mock implementation for Pusher
 */
class MockPusher {
  private channels: Record<string, any> = {};
  
  channel(name: string) {
    if (!this.channels[name]) {
      this.channels[name] = {
        trigger: (event: string, data: any) => {
          console.log(`[MockPusher] Event ${event} triggered on channel ${name}`, data);
          return true;
        }
      };
    }
    return this.channels[name];
  }
  
  disconnect() {
    this.channels = {};
  }
}

// Create a singleton instance
const pusherInstance = new MockPusher();

/**
 * Get the Pusher instance
 * @returns {any} The mock Pusher instance
 */
export const getPusher = (): any => {
  return pusherInstance;
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
 * Subscribe to a channel
 * @param {string} channelName - Channel name
 * @returns {any} The channel instance
 */
export const subscribeToChannel = (channelName: string): any => {
  // Mock channel implementation with the minimum needed functionality
  return {
    bind: (event: string, callback: (data: any) => void) => {
      // In a real implementation, this would register event handlers
      console.log(`[MockChannel] Subscribed to ${event} on ${channelName}`);
      return { unbind: () => {} };
    },
    trigger: (event: string, data: any) => {
      // In a real implementation, this would broadcast to all clients
      console.log(`[MockChannel] Event ${event} triggered on ${channelName}`, data);
      return true;
    },
    unbind: (event: string, callback: Function) => {
      // In a real implementation, this would remove event handlers
      console.log(`[MockChannel] Unsubscribed from ${event} on ${channelName}`);
      return {};
    }
  };
};

/**
 * Disconnect from all sync channels
 */
export const disconnectAllSyncChannels = (): void => {
  try {
    pusherInstance.disconnect();
    logger.info('Disconnected from all sync channels');
  } catch (error) {
    logger.error('Error disconnecting from sync channels:', error);
  }
};
