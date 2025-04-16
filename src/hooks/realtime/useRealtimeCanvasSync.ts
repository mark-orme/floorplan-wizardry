
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
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

// Utility function to mock the captureError from sentryUtils
const captureError = (error: unknown, metadata?: string) => {
  console.error('[RealtimeSync Error]:', error, metadata ? `Context: ${metadata}` : '');
};

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
  
  // Mock pusher functionality for now - will be replaced with actual Pusher integration
  const syncCanvas = useCallback((userName: string) => {
    if (!enabled || !canvas) return;
    
    // Clear any pending sync timeouts
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Set a timeout to throttle frequent updates
    syncTimeoutRef.current = setTimeout(() => {
      try {
        // For now, just log this - in a real implementation, we'd send to Pusher
        const timestamp = Date.now();
        const canvasJson = canvas.toJSON(['id', 'objectType']);
        
        logger.debug(`[RealtimeSync] Canvas synced by ${userName} at ${new Date(timestamp).toLocaleString()}`);
        
        // Update the last sync timestamp
        setLastSyncTimestamp(timestamp);
        
        // Update collaborator list
        setCollaborators(prev => {
          // Find existing collaborator
          const existingUserIndex = prev.findIndex(u => u.name === userName);
          
          if (existingUserIndex >= 0) {
            // Update existing collaborator's timestamp
            const updated = [...prev];
            updated[existingUserIndex] = {
              ...updated[existingUserIndex],
              lastActive: timestamp
            };
            return updated;
          } else {
            // Add new collaborator
            const color = COLORS[prev.length % COLORS.length];
            return [...prev, {
              id: `user-${Math.random().toString(36).substring(2, 9)}`,
              name: userName,
              color,
              lastActive: timestamp
            }];
          }
        });
        
        // In a real implementation, we'd send the canvas JSON to Pusher here
        // pusherChannel.trigger('canvas-update', { sender: userName, timestamp, canvasJson });
      } catch (error) {
        captureError(error, `realtimeSync:syncCanvas:${userName}`);
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
  
  // In a real implementation, we'd set up Pusher listeners here
  useEffect(() => {
    if (!enabled || !canvas) return;
    
    logger.info('[RealtimeSync] Realtime sync enabled');
    
    // Mock listener setup - in a real implementation, we'd set up Pusher listeners here
    const handleRemoteUpdate = (data: { sender: string, timestamp: number, canvasJson: any }) => {
      if (data.sender === userId.current) return; // Ignore our own updates
      
      try {
        // Load canvas from JSON
        canvas.loadFromJSON(data.canvasJson, () => {
          canvas.requestRenderAll();
          
          // Update collaborator list
          setCollaborators(prev => {
            const existingUserIndex = prev.findIndex(u => u.name === data.sender);
            
            if (existingUserIndex >= 0) {
              const updated = [...prev];
              updated[existingUserIndex] = {
                ...updated[existingUserIndex],
                lastActive: data.timestamp
              };
              return updated;
            } else {
              const color = COLORS[prev.length % COLORS.length];
              return [...prev, {
                id: `user-${Math.random().toString(36).substring(2, 9)}`,
                name: data.sender,
                color,
                lastActive: data.timestamp
              }];
            }
          });
          
          // Callback if provided
          if (onRemoteUpdate) {
            onRemoteUpdate(data.sender, data.timestamp);
          }
        });
      } catch (error) {
        captureError(error, `realtimeSync:remoteUpdate:${data.sender}`);
        toast.error('Failed to apply remote canvas update');
      }
    };
    
    // In a real implementation, we'd remove the Pusher listeners here
    return () => {
      logger.info('[RealtimeSync] Realtime sync disabled');
    };
  }, [canvas, enabled, onRemoteUpdate]);
  
  return {
    collaborators,
    syncCanvas,
    lastSyncTimestamp
  };
};
