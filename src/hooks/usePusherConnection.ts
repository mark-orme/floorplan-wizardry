
/**
 * Custom hook for Pusher connection
 * Establishes and manages real-time connection via Pusher
 * @module usePusherConnection
 */
import { useEffect, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';
import { toast } from 'sonner';
import { handleError } from '@/utils/errorHandling';

// Define constants for Pusher connection
const PUSHER_CONSTANTS = {
  APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'eu',
  CHANNEL_PREFIX: 'floorplan-',
  EVENT_TYPES: {
    UPDATE: 'floorplan-update',
    NOTIFICATION: 'notification',
    COLLABORATION: 'collaboration-event'
  }
};

/**
 * Hook return type for usePusherConnection
 * @interface UsePusherConnectionReturn
 */
interface UsePusherConnectionReturn {
  /** Current connected Pusher channel */
  channel: Channel | null;
  /** Whether the connection is established */
  isConnected: boolean;
  /** Connection error if any */
  error: Error | null;
  /** Disconnect from Pusher */
  disconnect: () => void;
  /** Reconnect to Pusher */
  reconnect: () => void;
}

/**
 * Hook that manages Pusher connection for real-time updates
 * 
 * @param {string} floorplanId - Floorplan ID to subscribe to
 * @returns {UsePusherConnectionReturn} Pusher connection state and controls
 */
export const usePusherConnection = (floorplanId?: string): UsePusherConnectionReturn => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Connect to Pusher and subscribe to the floorplan channel
   */
  const connect = (id: string) => {
    try {
      // Only initialize if we have an app key
      if (!PUSHER_CONSTANTS.APP_KEY) {
        console.warn('Pusher app key not configured');
        return;
      }
      
      // Create Pusher instance
      const pusherInstance = new Pusher(PUSHER_CONSTANTS.APP_KEY, {
        cluster: PUSHER_CONSTANTS.APP_CLUSTER,
        forceTLS: true
      });
      
      // Handle connection events
      pusherInstance.connection.bind('connected', () => {
        console.log('Connected to Pusher');
        setIsConnected(true);
      });
      
      pusherInstance.connection.bind('disconnected', () => {
        console.log('Disconnected from Pusher');
        setIsConnected(false);
      });
      
      pusherInstance.connection.bind('error', (err: Error) => {
        console.error('Pusher connection error:', err);
        setError(err);
        setIsConnected(false);
      });
      
      // Subscribe to the floorplan channel
      const channelName = `${PUSHER_CONSTANTS.CHANNEL_PREFIX}${id}`;
      const floorplanChannel = pusherInstance.subscribe(channelName);
      
      // Bind to floorplan update events
      floorplanChannel.bind(PUSHER_CONSTANTS.EVENT_TYPES.UPDATE, (data: any) => {
        console.log('Floorplan update received:', data);
        // Here you would handle the update, e.g., update canvas state
      });
      
      // Bind to notification events
      floorplanChannel.bind(PUSHER_CONSTANTS.EVENT_TYPES.NOTIFICATION, (data: any) => {
        console.log('Notification received:', data);
        toast.info(data.message || 'New update available');
      });
      
      // Store the Pusher instance and channel
      setPusher(pusherInstance);
      setChannel(floorplanChannel);
      
    } catch (err) {
      handleError(err, 'error', {
        component: 'usePusherConnection',
        operation: 'connect-to-pusher'
      });
      setError(err instanceof Error ? err : new Error('Failed to connect to Pusher'));
      setIsConnected(false);
    }
  };
  
  /**
   * Disconnect from Pusher
   */
  const disconnect = () => {
    if (pusher) {
      try {
        if (channel && floorplanId) {
          pusher.unsubscribe(`${PUSHER_CONSTANTS.CHANNEL_PREFIX}${floorplanId}`);
        }
        pusher.disconnect();
        setIsConnected(false);
        setPusher(null);
        setChannel(null);
      } catch (err) {
        console.error('Error disconnecting from Pusher:', err);
      }
    }
  };
  
  /**
   * Reconnect to Pusher
   */
  const reconnect = () => {
    if (floorplanId) {
      disconnect();
      connect(floorplanId);
    }
  };
  
  // Connect to Pusher when floorplanId changes
  useEffect(() => {
    if (floorplanId) {
      connect(floorplanId);
      
      // Clean up on unmount or floorplanId change
      return () => {
        disconnect();
      };
    }
  }, [floorplanId]);
  
  return {
    channel,
    isConnected,
    error,
    disconnect,
    reconnect
  };
};
