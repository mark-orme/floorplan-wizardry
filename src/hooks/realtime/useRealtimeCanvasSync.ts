
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { subscribeToChannel, getPusher, isUpdateFromThisDevice } from '@/utils/syncService';
import { UPDATE_EVENT, PRESENCE_EVENT } from '@/utils/syncService';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
  lastSeen: Date;
}

export interface RealtimeCanvasSyncResult {
  collaborators: Collaborator[];
  syncCanvas: (userName: string) => void;
  lastSyncTimestamp: number | null;
}

interface UseRealtimeCanvasSyncProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  throttleMs?: number;
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
}

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A1',
  '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF', '#33FF8C'
];

export const useRealtimeCanvasSync = ({
  canvas,
  enabled = true,
  throttleMs = 500,
  onRemoteUpdate
}: UseRealtimeCanvasSyncProps): RealtimeCanvasSyncResult => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useRef<string>(`user-${Math.random().toString(36).substring(2, 9)}`);
  const channelRef = useRef<any>(null);
  
  // Initialize Pusher channel
  useEffect(() => {
    if (!enabled) return;
    
    try {
      // Subscribe to the canvas sync channel
      const channelName = `canvas-collab-${window.location.pathname.replace(/\//g, '-') || 'default'}`;
      channelRef.current = subscribeToChannel(channelName);
      
      logger.info(`[RealtimeSync] Subscribed to channel: ${channelName}`);
      
      // Initialize presence
      notifyPresence();
      
      return () => {
        // Clean up channel subscription
        if (channelRef.current) {
          const pusher = getPusher();
          pusher.unsubscribe(channelName);
          channelRef.current = null;
          logger.info(`[RealtimeSync] Unsubscribed from channel: ${channelName}`);
        }
      };
    } catch (error) {
      logger.error('[RealtimeSync] Error initializing channel:', error);
      toast.error('Failed to initialize collaborative editing');
    }
  }, [enabled]);
  
  // Set up listeners for real-time updates
  useEffect(() => {
    if (!enabled || !canvas || !channelRef.current) return;
    
    const handleCanvasUpdate = (data: any) => {
      try {
        // Ignore updates from this device
        if (isUpdateFromThisDevice(data.deviceId)) {
          logger.debug('[RealtimeSync] Ignored update from this device');
          return;
        }
        
        // Apply the canvas state
        applyCanvasState(canvas, data.canvasState);
        
        // Update last sync timestamp
        setLastSyncTimestamp(data.timestamp);
        
        // Update collaborator information
        updateCollaboratorStatus(data.userName, data.timestamp);
        
        // Callback if provided
        if (onRemoteUpdate) {
          onRemoteUpdate(data.userName, data.timestamp);
        }
        
        logger.info(`[RealtimeSync] Applied canvas update from ${data.userName}`);
        
        // Show toast notification
        toast.info(`Canvas updated by ${data.userName}`, {
          id: 'canvas-update-notification',
          duration: 2000
        });
      } catch (error) {
        logger.error('[RealtimeSync] Error handling canvas update:', error);
      }
    };
    
    const handlePresenceUpdate = (data: any) => {
      try {
        // Ignore updates from this device
        if (isUpdateFromThisDevice(data.deviceId)) {
          return;
        }
        
        // Update collaborator list
        updateCollaboratorStatus(data.userName, data.timestamp);
        
        logger.info(`[RealtimeSync] Presence update from ${data.userName}`);
      } catch (error) {
        logger.error('[RealtimeSync] Error handling presence update:', error);
      }
    };
    
    // Bind event handlers to channel
    channelRef.current.bind(`client-${UPDATE_EVENT}`, handleCanvasUpdate);
    channelRef.current.bind(`client-${PRESENCE_EVENT}`, handlePresenceUpdate);
    
    return () => {
      // Unbind event handlers
      if (channelRef.current) {
        channelRef.current.unbind(`client-${UPDATE_EVENT}`, handleCanvasUpdate);
        channelRef.current.unbind(`client-${PRESENCE_EVENT}`, handlePresenceUpdate);
      }
    };
  }, [canvas, enabled, onRemoteUpdate]);
  
  // Helper function to update collaborator status
  const updateCollaboratorStatus = (userName: string, timestamp: number) => {
    setCollaborators(prev => {
      // Find existing collaborator
      const existingIndex = prev.findIndex(c => c.name === userName);
      
      if (existingIndex >= 0) {
        // Update existing collaborator
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastActive: timestamp,
          isActive: true,
          lastSeen: new Date()
        };
        return updated;
      } else {
        // Add new collaborator
        const color = COLORS[prev.length % COLORS.length];
        return [...prev, {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          name: userName,
          color,
          lastActive: timestamp,
          isActive: true,
          lastSeen: new Date()
        }];
      }
    });
  };
  
  // Cleanup inactive collaborators
  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setCollaborators(prev => 
        prev.map(collaborator => ({
          ...collaborator,
          isActive: now - collaborator.lastActive < 60000 // Active if seen in the last minute
        }))
      );
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [enabled]);
  
  // Notify presence
  const notifyPresence = useCallback(() => {
    if (!enabled || !channelRef.current) return;
    
    try {
      const pusher = getPusher();
      const timestamp = Date.now();
      
      // Trigger a client event for presence
      channelRef.current.trigger(`client-${PRESENCE_EVENT}`, {
        userName: userId.current,
        deviceId: userId.current, // Using userId as deviceId for simplicity
        timestamp
      });
      
      logger.debug('[RealtimeSync] Presence notification sent');
    } catch (error) {
      logger.error('[RealtimeSync] Error sending presence notification:', error);
    }
  }, [enabled]);
  
  // Send periodic presence updates
  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(notifyPresence, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [enabled, notifyPresence]);
  
  // Function to sync canvas state
  const syncCanvas = useCallback((userName: string) => {
    if (!enabled || !canvas || !channelRef.current) return;
    
    // Clear any pending sync timeouts
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Set a timeout to throttle frequent updates
    syncTimeoutRef.current = setTimeout(() => {
      try {
        const timestamp = Date.now();
        const canvasState = captureCanvasState(canvas);
        
        // Trigger a client event to broadcast the canvas update
        channelRef.current.trigger(`client-${UPDATE_EVENT}`, {
          userName,
          deviceId: userId.current, // Using userId as deviceId for simplicity
          timestamp,
          canvasState
        });
        
        // Update the last sync timestamp
        setLastSyncTimestamp(timestamp);
        
        // Update own collaborator status
        updateCollaboratorStatus(userName, timestamp);
        
        logger.debug(`[RealtimeSync] Canvas synced by ${userName}`);
      } catch (error) {
        logger.error('[RealtimeSync] Error syncing canvas:', error);
        toast.error('Failed to sync canvas');
      }
    }, throttleMs);
  }, [canvas, enabled, throttleMs]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    collaborators,
    syncCanvas,
    lastSyncTimestamp
  };
};
