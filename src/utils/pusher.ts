
/**
 * Pusher service for handling real-time communication
 * @module pusher
 */
import Pusher from 'pusher-js';
import logger from './logger';
import { initializeCSP } from './security/contentSecurityPolicy';

// Pusher credentials
const PUSHER_APP_ID = "1964045";
const PUSHER_KEY = "223ca3179f24cb01f737";
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
    
    // Check if CSP is properly configured with Pusher domains
    const checkCspForPusher = () => {
      const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspTag) {
        logger.warn('No CSP meta tag found before Pusher initialization');
        return false;
      }
      
      const cspContent = cspTag.getAttribute('content') || '';
      const hasPusherDomain = cspContent.includes('pusher.com');
      logger.info('CSP check for Pusher domains', { hasPusherDomain, cspContent });
      return hasPusherDomain;
    };
    
    // First check if CSP has Pusher domains
    if (!checkCspForPusher()) {
      logger.warn('CSP missing Pusher domains, attempting to refresh CSP');
      try {
        // Force refresh CSP to ensure it has Pusher domains
        initializeCSP(true);
        logger.info('CSP refreshed before Pusher initialization');
      } catch (error) {
        logger.warn('Failed to refresh CSP before Pusher initialization', { error });
      }
    }
    
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
          error: error?.message,
          recommendation: 'Ensure connect-src directive includes Pusher domains'
        });
        
        // Automatically try to fix CSP if possible
        try {
          if (typeof window !== 'undefined') {
            // Force reinitialization of CSP
            initializeCSP(true);
            logger.info('CSP refreshed to try to allow Pusher connectivity');
            
            // Check if refresh worked
            setTimeout(() => {
              const refreshWorked = checkCspForPusher();
              logger.info('CSP refresh result for Pusher domains', { refreshWorked });
            }, 100);
          }
        } catch (fixError) {
          logger.error('Failed to refresh CSP settings:', fixError);
        }
      } else {
        logger.error('Pusher connection error:', error);
      }
      
      // If we've had multiple failures, switch to mock implementation
      if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        logger.warn(`Switching to mock Pusher after ${connectionAttempts} failed connection attempts`);
        pusherInstance = createMockPusherInstance();
      }
    };
    
    // Configure Pusher with error handling
    try {
      // First verify CSP has been applied with Pusher domains
      setTimeout(() => {
        // Log CSP state right before Pusher instance creation
        logger.info('CSP state at Pusher initialization:', 
          document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') || 'No CSP found');
      }, 0);
      
      // Create the Pusher instance with detailed configuration
      pusherInstance = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        wsHost: 'ws-eu.pusher.com',
        httpHost: 'sockjs-eu.pusher.com',
        disableStats: true, // Reduce network requests
        authEndpoint: undefined, // No authentication endpoint needed for public channels
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
      
      logger.info('Pusher instance created successfully');
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
  
  // Create a more complete mock Pusher instance
  const mockPusher = {} as Pusher;
  
  // Mock connection
  mockPusher.connection = {
    bind: (event: string, callback: Function) => {
      if (event === 'connected') {
        // Simulate connected event
        setTimeout(() => callback(), 100);
      }
      return mockPusher.connection;
    },
    unbind: () => mockPusher.connection,
    state: 'connected'
  } as any;
  
  // Mock channel management
  const channels: Record<string, any> = {};
  
  mockPusher.subscribe = (channelName: string) => {
    logger.info(`[MOCK] Subscribing to channel: ${channelName}`);
    
    if (!channels[channelName]) {
      channels[channelName] = {
        bind: (event: string, callback: Function) => {
          logger.info(`[MOCK] Event bound on channel ${channelName}: ${event}`);
          return channels[channelName];
        },
        unbind: () => channels[channelName],
        trigger: (eventName: string, data: any) => {
          logger.info(`[MOCK] Event triggered on channel ${channelName}: ${eventName}`);
        },
        subscribed: true,
        name: channelName
      };
    }
    
    return channels[channelName];
  };
  
  mockPusher.unsubscribe = (channelName: string) => {
    logger.info(`[MOCK] Unsubscribing from channel: ${channelName}`);
    delete channels[channelName];
  };
  
  mockPusher.disconnect = () => {
    logger.info(`[MOCK] Disconnecting Pusher`);
  };
  
  mockPusher.channel = (channelName: string) => {
    return channels[channelName] || null;
  };
  
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
