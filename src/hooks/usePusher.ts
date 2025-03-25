
/**
 * Custom hook for using Pusher in React components
 * @module usePusher
 */
import { useEffect, useState, useCallback } from 'react';
import { Channel } from 'pusher-js';
import { subscribeToChannel, unsubscribeFromChannel } from '@/utils/pusher';
import logger from '@/utils/logger';

interface UsePusherOptions {
  channelName: string;
  events: Record<string, (data: any) => void>;
  enableSubscription?: boolean;
}

export const usePusher = ({ 
  channelName, 
  events, 
  enableSubscription = true 
}: UsePusherOptions) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Subscribe to channel
  useEffect(() => {
    if (!enableSubscription) return;
    
    try {
      logger.info(`Setting up Pusher subscription to ${channelName}`);
      const newChannel = subscribeToChannel(channelName);
      
      // Bind events
      Object.entries(events).forEach(([eventName, callback]) => {
        newChannel.bind(eventName, callback);
      });
      
      setChannel(newChannel);
      setIsConnected(true);
      
      // Cleanup on unmount
      return () => {
        logger.info(`Cleaning up Pusher subscription to ${channelName}`);
        
        // Unbind events
        Object.keys(events).forEach((eventName) => {
          newChannel.unbind(eventName);
        });
        
        unsubscribeFromChannel(channelName);
        setChannel(null);
        setIsConnected(false);
      };
    } catch (error) {
      logger.error('Error setting up Pusher subscription:', error);
      setIsConnected(false);
    }
  }, [channelName, enableSubscription]);

  // Function to manually trigger events for testing
  const triggerEvent = useCallback((eventName: string, data: any) => {
    logger.info(`Manually triggering event ${eventName} on channel ${channelName}:`, data);
    if (channel) {
      // In a real app, you'd typically send this to your server to trigger
      // This is just for local testing/debugging
      if (events[eventName]) {
        events[eventName](data);
      }
    }
  }, [channel, channelName, events]);

  return {
    channel,
    isConnected,
    triggerEvent
  };
};
