
import Pusher from 'pusher-js';
import logger from './logger';

// Pusher configuration
const PUSHER_CONFIG = {
  key: import.meta.env.VITE_PUSHER_APP_KEY || '',
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
  forceTLS: true,
  enabledTransports: ['ws', 'wss'] as ('ws' | 'wss')[],
  disabledTransports: [] as ('ws' | 'wss')[]
};

// Validate Pusher configuration
const validatePusherConfig = () => {
  if (!PUSHER_CONFIG.key) {
    logger.warn('Pusher app key is missing. Real-time features will be disabled.');
    return false;
  }
  return true;
};

// Singleton instance of Pusher
let pusherInstance: Pusher | null = null;

/**
 * Get or create a Pusher instance
 * @returns {Pusher | null} The Pusher instance or null if configuration is invalid
 */
export const getPusher = (): Pusher | null => {
  if (!validatePusherConfig()) {
    return null;
  }

  if (!pusherInstance) {
    try {
      pusherInstance = new Pusher(PUSHER_CONFIG.key, {
        cluster: PUSHER_CONFIG.cluster,
        forceTLS: PUSHER_CONFIG.forceTLS,
        enabledTransports: PUSHER_CONFIG.enabledTransports,
        disabledTransports: PUSHER_CONFIG.disabledTransports
      });
      
      // Log connection events
      pusherInstance.connection.bind('connected', () => {
        logger.info('Pusher connected successfully');
      });
      
      pusherInstance.connection.bind('disconnected', () => {
        logger.warn('Pusher disconnected');
      });
      
      pusherInstance.connection.bind('error', (err: any) => {
        logger.error('Pusher connection error:', err);
      });
      
    } catch (error) {
      logger.error('Error initializing Pusher:', error);
      return null;
    }
  }
  
  return pusherInstance;
};

/**
 * Subscribe to a Pusher channel
 * @param {string} channelName - Name of the channel to subscribe to
 * @returns {Pusher.Channel} The channel instance
 */
export const subscribeToChannel = (channelName: string) => {
  try {
    const pusher = getPusher();
    return pusher.subscribe(channelName);
  } catch (error) {
    logger.error(`Error subscribing to channel ${channelName}:`, error);
    throw new Error(`Failed to subscribe to channel: ${channelName}`);
  }
};

/**
 * Unsubscribe from a Pusher channel
 * @param {string} channelName - Name of the channel to unsubscribe from
 */
export const unsubscribeFromChannel = (channelName: string) => {
  try {
    const pusher = getPusher();
    pusher.unsubscribe(channelName);
    logger.info(`Unsubscribed from channel: ${channelName}`);
  } catch (error) {
    logger.error(`Error unsubscribing from channel ${channelName}:`, error);
  }
};

/**
 * Clean up Pusher resources
 */
export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
    logger.info('Pusher disconnected and instance removed');
  }
};

export default {
  getPusher,
  subscribeToChannel,
  unsubscribeFromChannel,
  disconnectPusher
};
