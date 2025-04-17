import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { getPusher, subscribeSyncChannel, UPDATE_EVENT, PRESENCE_EVENT, isUpdateFromThisDevice } from '@/utils/syncService';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';
import { useOptimizedGeometryWorker } from '@/hooks/useOptimizedGeometryWorker';
import logger from '@/utils/logger';
import throttle from 'lodash/throttle';

// Worker color assignment
const COLLABORATOR_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
  '#33FFF0', '#F0FF33', '#FF8033', '#8033FF', '#33FF80'
];

// Collaborator information
export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
  lastSeen?: Date;
}

interface UseRealtimeCanvasSyncProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  userName?: string;
  updateThrottleMs?: number;
  presenceUpdateIntervalMs?: number;
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
}

export function useRealtimeCanvasSync({
  canvas,
  enabled = true,
  userName = 'Anonymous',
  updateThrottleMs = 500,
  presenceUpdateIntervalMs = 30000,
  onRemoteUpdate
}: UseRealtimeCanvasSyncProps) {
  // Track collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  
  // Channel reference
  const channelRef = useRef<any>(null);
  
  // Track user ID
  const userIdRef = useRef<string>(`user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  // Get worker hook for geometry optimizations during sync operations
  const { optimizePoints } = useOptimizedGeometryWorker();
  
  // Throttle update function to prevent excessive network traffic
  const throttledSync = useCallback(
    throttle((senderName: string) => {
      if (!canvas || !channelRef.current) return;
      
      try {
        // Get canvas state
        const state = captureCanvasState(canvas);
        
        // Skip empty updates
        if (!state) return;
        
        // Send update event with device ID to prevent loops
        channelRef.current.trigger(UPDATE_EVENT, {
          senderId: userIdRef.current,
          senderName,
          state,
          timestamp: Date.now()
        });
        
        logger.debug('Canvas sync sent', { sender: senderName, stateLength: state.length });
      } catch (error) {
        logger.error('Error syncing canvas:', error);
      }
    }, updateThrottleMs),
    [canvas, updateThrottleMs]
  );
  
  // Send presence update to show user is still active
  const sendPresenceUpdate = useCallback(() => {
    if (!channelRef.current) return;
    
    try {
      channelRef.current.trigger(PRESENCE_EVENT, {
        id: userIdRef.current,
        name: userName,
        lastActive: Date.now()
      });
    } catch (error) {
      logger.error('Error sending presence update:', error);
    }
  }, [userName]);
  
  // Manually sync canvas now - exposed for external triggers
  const syncCanvas = useCallback((senderName: string = userName) => {
    throttledSync(senderName);
  }, [userName, throttledSync]);
  
  // Process canvas update events
  const handleCanvasUpdate = useCallback(async (data: any) => {
    if (!canvas) return;
    
    try {
      // Ignore updates from this device
      if (isUpdateFromThisDevice(data.senderId)) {
        return;
      }
      
      // Apply the state
      applyCanvasState(canvas, data.state);
      
      // Call update callback if provided
      if (onRemoteUpdate) {
        onRemoteUpdate(data.senderName || 'Unknown', data.timestamp || Date.now());
      }
      
      // Update collaborator activity
      setCollaborators(prev => {
        const collaborator = prev.find(c => c.id === data.senderId);
        if (collaborator) {
          // Update existing collaborator
          return prev.map(c => c.id === data.senderId ? {
            ...c,
            lastActive: Date.now(),
            isActive: true,
            lastSeen: new Date()
          } : c);
        } else if (data.senderName) {
          // Add new collaborator with next available color
          const colorIndex = prev.length % COLLABORATOR_COLORS.length;
          return [...prev, {
            id: data.senderId,
            name: data.senderName,
            color: COLLABORATOR_COLORS[colorIndex],
            lastActive: Date.now(),
            isActive: true,
            lastSeen: new Date()
          }];
        }
        return prev;
      });
      
      logger.debug('Canvas update received', { sender: data.senderName });
    } catch (error) {
      logger.error('Error handling canvas update:', error);
    }
  }, [canvas, onRemoteUpdate]);
  
  // Process presence update events
  const handlePresenceUpdate = useCallback((data: any) => {
    // Update collaborator list with activity info
    setCollaborators(prev => {
      const existing = prev.find(c => c.id === data.id);
      if (existing) {
        // Update existing collaborator
        return prev.map(c => c.id === data.id ? {
          ...c,
          name: data.name || c.name,
          lastActive: data.lastActive || Date.now(),
          isActive: true,
          lastSeen: new Date()
        } : c);
      } else if (data.name) {
        // Add new collaborator with next available color
        const colorIndex = prev.length % COLLABORATOR_COLORS.length;
        return [...prev, {
          id: data.id,
          name: data.name,
          color: COLLABORATOR_COLORS[colorIndex],
          lastActive: data.lastActive || Date.now(),
          isActive: true,
          lastSeen: new Date()
        }];
      }
      return prev;
    });
  }, []);
  
  // Mark inactive collaborators
  const checkCollaboratorActivity = useCallback(() => {
    const now = Date.now();
    const INACTIVE_THRESHOLD_MS = 60000; // 1 minute
    
    setCollaborators(prev => prev.map(collaborator => ({
      ...collaborator,
      isActive: now - collaborator.lastActive < INACTIVE_THRESHOLD_MS
    })));
  }, []);
  
  // Set up canvas event listeners for auto-sync
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Listen for canvas changes to auto-sync
    const handleModified = () => {
      syncCanvas();
    };
    
    // Add event listeners
    canvas.on('object:modified', handleModified);
    canvas.on('object:added', handleModified);
    canvas.on('object:removed', handleModified);
    
    // Clean up listeners
    return () => {
      canvas.off('object:modified', handleModified);
      canvas.off('object:added', handleModified);
      canvas.off('object:removed', handleModified);
    };
  }, [canvas, enabled, syncCanvas]);
  
  // Set up sync channel subscription
  useEffect(() => {
    if (!enabled) return;
    
    try {
      // Create channel name based on URL path
      const channelName = `canvas-collab-${window.location.pathname.replace(/\//g, '-') || 'default'}`;
      
      // Subscribe to channel
      const channel = subscribeSyncChannel(channelName);
      channelRef.current = channel;
      
      // Set up event listeners
      channel.bind(UPDATE_EVENT, handleCanvasUpdate);
      channel.bind(PRESENCE_EVENT, handlePresenceUpdate);
      
      // Send initial presence update
      sendPresenceUpdate();
      
      // Set up periodic presence updates to keep collaboration active
      const presenceInterval = setInterval(sendPresenceUpdate, presenceUpdateIntervalMs);
      
      // Check for inactive collaborators periodically
      const activityInterval = setInterval(checkCollaboratorActivity, 10000);
      
      logger.info('Canvas sync enabled');
      
      // Clean up
      return () => {
        if (channel) {
          // Unbind all events
          channel.unbind(UPDATE_EVENT, handleCanvasUpdate);
          channel.unbind(PRESENCE_EVENT, handlePresenceUpdate);
        }
        
        // Clear intervals
        clearInterval(presenceInterval);
        clearInterval(activityInterval);
        
        logger.info('Canvas sync disabled');
      };
    } catch (error) {
      logger.error('Error setting up canvas sync:', error);
      return undefined;
    }
  }, [enabled, handleCanvasUpdate, handlePresenceUpdate, sendPresenceUpdate, 
      presenceUpdateIntervalMs, checkCollaboratorActivity]);
  
  return { collaborators, syncCanvas };
}
