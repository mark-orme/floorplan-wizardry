
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';
import { toast } from 'sonner';
import logger from '@/utils/logger';

// Collaborator colors for user differentiation
const COLLABORATOR_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
  '#33FFF0', '#F0FF33', '#FF8033', '#8033FF', '#33FF80'
];

// Interface for collaborator information
export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
  lastSeen?: Date;
}

interface UseRealtimeCRDTSyncProps {
  canvas: FabricCanvas | null;
  roomId: string;
  userId: string;
  userName: string;
  enabled?: boolean;
  onRemoteUpdate?: () => void;
}

export function useRealtimeCRDTSync({
  canvas,
  roomId,
  userId,
  userName,
  enabled = true,
  onRemoteUpdate
}: UseRealtimeCRDTSyncProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // References to Y.js document and shared data
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const canvasStateRef = useRef<Y.Map<any> | null>(null);
  const awarenessRef = useRef<any>(null);

  // Initialize Y.js document and WebSocket connection
  useEffect(() => {
    if (!enabled || !canvas) return;

    // Create Y.js document
    const doc = new Y.Doc();
    docRef.current = doc;

    // Connect to WebSocket server
    // Note: In production, use your own WebSocket server or a service like Yjs-websocket
    const wsUrl = 'wss://demos.yjs.dev';
    const provider = new WebsocketProvider(wsUrl, `floor-plan-${roomId}`, doc, {
      connect: true,
      awareness: {
        // Initial client state
        clientID: userId,
        user: {
          id: userId,
          name: userName,
          color: COLLABORATOR_COLORS[Math.floor(Math.random() * COLLABORATOR_COLORS.length)],
          lastActive: Date.now()
        }
      }
    });
    providerRef.current = provider;

    // Get awareness API for tracking users
    const awareness = provider.awareness;
    awarenessRef.current = awareness;

    // Get shared state for canvas
    const canvasState = doc.getMap('canvasState');
    canvasStateRef.current = canvasState;

    // Handle connection status changes
    provider.on('status', ({ status }: { status: string }) => {
      const connected = status === 'connected';
      setIsConnected(connected);
      if (connected) {
        toast.success('Connected to collaboration server');
      } else {
        toast.error('Disconnected from collaboration server');
      }
    });

    // Handle awareness updates (users joining/leaving)
    awareness.on('change', () => {
      const states = awareness.getStates() as Map<number, any>;
      const activeCollaborators: Collaborator[] = [];

      states.forEach((state, clientId) => {
        if (state.user && clientId.toString() !== userId) {
          activeCollaborators.push({
            id: state.user.id || clientId.toString(),
            name: state.user.name || 'Anonymous',
            color: state.user.color || '#FF5733',
            lastActive: state.user.lastActive || Date.now(),
            isActive: true,
            lastSeen: new Date()
          });
        }
      });

      setCollaborators(activeCollaborators);
    });

    // Listen for canvas state changes
    canvasState.observe(() => {
      if (!canvas) return;
      
      // Get the latest state and last modified user
      const serializedState = canvasState.get('state');
      const lastModifiedBy = canvasState.get('lastModifiedBy');
      
      // Only apply changes from other users
      if (lastModifiedBy && lastModifiedBy.id !== userId && serializedState) {
        try {
          // Apply canvas state
          applyCanvasState(canvas, serializedState);
          
          // Notify about the update
          if (onRemoteUpdate) {
            onRemoteUpdate();
          }
          
          logger.info(`Applied canvas changes from ${lastModifiedBy.name || 'another user'}`);
        } catch (error) {
          logger.error('Error applying remote canvas changes:', error);
        }
      }
    });

    // Cleanup
    return () => {
      if (provider) {
        provider.disconnect();
      }
      if (doc) {
        doc.destroy();
      }
    };
  }, [canvas, roomId, userId, userName, enabled, onRemoteUpdate]);

  // Function to sync local changes to the shared document
  const syncLocalChanges = useCallback(() => {
    if (!canvas || !canvasStateRef.current || !docRef.current) return;

    try {
      // Capture canvas state
      const state = captureCanvasState(canvas);
      
      // Update shared state in a single transaction
      docRef.current.transact(() => {
        canvasStateRef.current?.set('state', state);
        canvasStateRef.current?.set('lastModifiedBy', {
          id: userId,
          name: userName,
          timestamp: Date.now()
        });
      });
      
      logger.debug('Synced local changes to CRDT');
      
      // Update user's active status
      if (awarenessRef.current) {
        const currentState = awarenessRef.current.getLocalState();
        awarenessRef.current.setLocalState({
          ...currentState,
          user: {
            ...currentState.user,
            lastActive: Date.now()
          }
        });
      }
    } catch (error) {
      logger.error('Error syncing local changes:', error);
    }
  }, [canvas, userId, userName]);

  return {
    collaborators,
    isConnected,
    syncLocalChanges
  };
}
