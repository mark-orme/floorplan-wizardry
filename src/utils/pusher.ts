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
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * Initialize and get the Pusher instance
 * @returns The Pusher instance (or a mock if connection fails)
 */
export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    logger.info('Initializing Pusher connection');
    
    // Don't try more than MAX_RECONNECT_ATTEMPTS times to connect
    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.warn(`Maximum Pusher connection attempts (${MAX_RECONNECT_ATTEMPTS}) reached, using mock Pusher`);
      return createMockPusherInstance();
    }
    
    connectionAttempts++;
    
    // Add logging for CSP failures
    const handlePusherError = (error: any) => {
      if (error?.message?.includes('Refused to connect') || 
          error?.message?.includes('violated Content Security Policy directive')) {
        logger.warn('Pusher connection blocked by CSP - check CSP settings to allow Pusher domains', {
          attempt: connectionAttempts,
          error: error?.message
        });
      } else {
        logger.error('Pusher connection error:', error);
      }
      
      // If we've had multiple failures, switch to mock implementation
      if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        pusherInstance = createMockPusherInstance();
      }
    };
    
    // Configure Pusher with error handling
    try {
      pusherInstance = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        wsHost: 'ws-eu.pusher.com',
        httpHost: 'sockjs-eu.pusher.com',
        disableStats: true // Reduce network requests
      });
      
      // Add connection status handlers
      pusherInstance.connection.bind('connected', () => {
        logger.info('Connected to Pusher');
        connectionAttempts = 0; // Reset attempts on successful connection
      });
      
      pusherInstance.connection.bind('disconnected', () => {
        logger.info('Disconnected from Pusher');
      });
      
      pusherInstance.connection.bind('error', handlePusherError);
    } catch (err) {
      logger.error('Failed to initialize Pusher:', err);
      pusherInstance = createMockPusherInstance();
    }
  }
  
  return pusherInstance;
};

/**
 * Create a mock Pusher instance that doesn't make network requests
 * Used as a fallback when real connection fails
 */
function createMockPusherInstance(): Pusher {
  logger.info('Creating mock Pusher instance to prevent errors');
  
  // Create a dummy Pusher instance to prevent errors
  const mockPusher = {} as Pusher;
  mockPusher.connection = {
    bind: () => {},
  } as any;
  mockPusher.subscribe = () => ({ bind: () => {} }) as any;
  mockPusher.unsubscribe = () => {};
  mockPusher.disconnect = () => {};
  
  return mockPusher;
}

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
