
/**
 * Pusher service for real-time communication
 * @module pusher
 */
import Pusher from 'pusher-js';
import logger from './logger';

// Pusher configuration
const PUSHER_CONFIG = {
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'demo-key',
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
  forceTLS: true,
  // Use proper types for transport configuration
  enabledTransports: ['ws', 'wss'] as ('ws' | 'wss')[],
  disabledTransports: [] as string[]
};

// Singleton instance of Pusher
let pusherInstance: Pusher | null = null;

/**
 * Get or create a Pusher instance
 * @returns {Pusher} The Pusher instance
 */
export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    try {
      // Create a new Pusher instance
      pusherInstance = new Pusher(PUSHER_CONFIG.key, {
        cluster: PUSHER_CONFIG.cluster,
        forceTLS: PUSHER_CONFIG.forceTLS,
        enabledTransports: PUSHER_CONFIG.enabledTransports,
        disabledTransports: PUSHER_CONFIG.disabledTransports
      });
      
      // Log successful connection
      pusherInstance.connection.bind('connected', () => {
        logger.info('Pusher connected');
      });
      
      // Log disconnection
      pusherInstance.connection.bind('disconnected', () => {
        logger.warn('Pusher disconnected');
      });
      
      // Log connection errors
      pusherInstance.connection.bind('error', (err: any) => {
        logger.error('Pusher connection error:', err);
      });
      
    } catch (error) {
      logger.error('Error initializing Pusher:', error);
      throw new Error('Failed to initialize Pusher');
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
