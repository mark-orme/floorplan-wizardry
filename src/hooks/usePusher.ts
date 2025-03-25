
/**
 * Custom hook for using Pusher in React components
 * @module usePusher
 */
import { useEffect, useState, useCallback, useRef } from 'react';
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
  // All state declarations first
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Then all refs
  const eventsRef = useRef(events);
  const channelNameRef = useRef(channelName);
  const enableSubscriptionRef = useRef(enableSubscription);
  const isMountedRef = useRef(true);
  
  // Update refs when props change
  useEffect(() => {
    eventsRef.current = events;
    channelNameRef.current = channelName;
    enableSubscriptionRef.current = enableSubscription;
  }, [events, channelName, enableSubscription]);

  // Subscribe to channel - in a dedicated effect with minimal dependencies
  useEffect(() => {
    // Skip if subscription is disabled
    if (!enableSubscriptionRef.current) return;
    
    let newChannel: Channel | null = null;
    
    const setupChannel = () => {
      try {
        logger.info(`Setting up Pusher subscription to ${channelNameRef.current}`);
        newChannel = subscribeToChannel(channelNameRef.current);
        
        // Bind events
        Object.entries(eventsRef.current).forEach(([eventName, callback]) => {
          if (newChannel) {
            newChannel.bind(eventName, callback);
          }
        });
        
        if (isMountedRef.current) {
          setChannel(newChannel);
          setIsConnected(true);
        }
      } catch (error) {
        logger.error('Error setting up Pusher subscription:', error);
        if (isMountedRef.current) {
          setIsConnected(false);
        }
      }
    };
    
    setupChannel();
    
    // Cleanup on unmount or channel change
    return () => {
      isMountedRef.current = false;
      
      if (newChannel) {
        logger.info(`Cleaning up Pusher subscription to ${channelNameRef.current}`);
        
        // Unbind events
        Object.keys(eventsRef.current).forEach((eventName) => {
          if (newChannel) {
            newChannel.unbind(eventName);
          }
        });
        
        unsubscribeFromChannel(channelNameRef.current);
        
        if (isMountedRef.current) {
          setChannel(null);
          setIsConnected(false);
        }
      }
    };
  }, []); // Empty dependency array - we use refs inside

  // Function to manually trigger events for testing - use callback for stable reference
  const triggerEvent = useCallback((eventName: string, data: any) => {
    logger.info(`Manually triggering event ${eventName} on channel ${channelNameRef.current}:`, data);
    if (channel) {
      // In a real app, you'd typically send this to your server to trigger
      // This is just for local testing/debugging
      const callback = eventsRef.current[eventName];
      if (callback) {
        callback(data);
      }
    }
  }, [channel]); // Only depend on channel

  return {
    channel,
    isConnected,
    triggerEvent
  };
};
