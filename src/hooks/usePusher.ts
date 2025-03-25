
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
  // All state declarations at the top level
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use refs to avoid dependency issues with events and preserve values across renders
  const eventsRef = useRef(events);
  const channelNameRef = useRef(channelName);
  
  // Update refs when props change - in a separate effect
  useEffect(() => {
    eventsRef.current = events;
    channelNameRef.current = channelName;
  }, [events, channelName]);

  // Subscribe to channel - in a dedicated effect with minimal dependencies
  useEffect(() => {
    if (!enableSubscription) return;
    
    let newChannel: Channel | null = null;
    
    try {
      logger.info(`Setting up Pusher subscription to ${channelName}`);
      newChannel = subscribeToChannel(channelName);
      
      // Bind events
      Object.entries(eventsRef.current).forEach(([eventName, callback]) => {
        if (newChannel) {
          newChannel.bind(eventName, callback);
        }
      });
      
      setChannel(newChannel);
      setIsConnected(true);
    } catch (error) {
      logger.error('Error setting up Pusher subscription:', error);
      setIsConnected(false);
    }
    
    // Cleanup on unmount or channel change
    return () => {
      if (newChannel) {
        logger.info(`Cleaning up Pusher subscription to ${channelName}`);
        
        // Unbind events
        Object.keys(eventsRef.current).forEach((eventName) => {
          if (newChannel) {
            newChannel.unbind(eventName);
          }
        });
        
        unsubscribeFromChannel(channelName);
        setChannel(null);
        setIsConnected(false);
      }
    };
  }, [channelName, enableSubscription]); // Only depend on these props

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
