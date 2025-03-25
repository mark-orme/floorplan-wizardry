
/**
 * Pusher service for handling real-time communication
 * @module pusher
 */
import Pusher from 'pusher-js';
import logger from './logger';

// Pusher credentials
const PUSHER_APP_ID = "1964045";
const PUSHER_KEY = "223ca3179f24cb01f737";
const PUSHER_SECRET = "f4744666044ab457d92a"; // Note: This is typically only used server-side
const PUSHER_CLUSTER = "eu";

// Initialize Pusher
let pusherInstance: Pusher | null = null;

/**
 * Initialize and get the Pusher instance
 * @returns The Pusher instance
 */
export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    logger.info('Initializing Pusher connection');
    
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true
    });
    
    // Add connection status handlers
    pusherInstance.connection.bind('connected', () => {
      logger.info('Connected to Pusher');
    });
    
    pusherInstance.connection.bind('disconnected', () => {
      logger.info('Disconnected from Pusher');
    });
    
    pusherInstance.connection.bind('error', (err: any) => {
      logger.error('Pusher connection error:', err);
    });
  }
  
  return pusherInstance;
};

/**
 * Subscribe to a Pusher channel
 * @param channelName The name of the channel to subscribe to
 * @returns The channel instance
 */
export const subscribeToChannel = (channelName: string) => {
  const pusher = getPusher();
  logger.info(`Subscribing to Pusher channel: ${channelName}`);
  return pusher.subscribe(channelName);
};

/**
 * Unsubscribe from a Pusher channel
 * @param channelName The name of the channel to unsubscribe from
 */
export const unsubscribeFromChannel = (channelName: string) => {
  const pusher = getPusher();
  logger.info(`Unsubscribing from Pusher channel: ${channelName}`);
  pusher.unsubscribe(channelName);
};

/**
 * Disconnect from Pusher
 */
export const disconnectPusher = () => {
  if (pusherInstance) {
    logger.info('Disconnecting Pusher');
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

export default {
  getPusher,
  subscribeToChannel,
  unsubscribeFromChannel,
  disconnectPusher
};
