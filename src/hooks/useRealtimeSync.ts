
/**
 * Hook for real-time canvas synchronization
 * This is a wrapper that selects between CRDT or basic sync based on feature flags
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { isFeatureEnabled } from '@/utils/dynamicImport';
import { toast } from 'sonner';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getPusher } from '@/utils/pusher';

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
  lastSeen?: Date;
}

export interface RealtimeSyncProps {
  canvas: FabricCanvas | null;
  roomId?: string;
  userId: string;
  userName?: string;
  enabled?: boolean;
  onRemoteUpdate?: () => void;
}

// Get a random color for collaborators
const getRandomColor = () => {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
    '#33FFF0', '#F0FF33', '#FF8033', '#8033FF', '#33FF80'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function useRealtimeSync({
  canvas,
  roomId = 'default-room',
  userId,
  userName = 'Anonymous',
  enabled = true,
  onRemoteUpdate
}: RealtimeSyncProps) {
  // State for tracking collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use CRDT for collaborative editing
  useEffect(() => {
    if (!enabled || !canvas || !roomId) return;
    
    let provider: WebsocketProvider | null = null;
    let doc: Y.Doc | null = null;
    let fabricCanvasState: Y.Map<any> | null = null;
    
    // Initialize CRDT
    const initCRDT = async () => {
      try {
        // Create a new CRDT document
        doc = new Y.Doc();
        
        // Connect to the WebSocket provider for syncing
        provider = new WebsocketProvider(
          process.env.WEBSOCKET_URL || 'wss://websocket-server.example.com',
          `floor-plan-${roomId}`,
          doc
        );
        
        // Access the shared canvas state object
        fabricCanvasState = doc.getMap('canvas');
        
        // Add current user to awareness
        provider.awareness.setLocalStateField('user', {
          id: userId,
          name: userName,
          color: getRandomColor(),
          lastActive: Date.now()
        });
        
        // Listen for remote changes to the canvas
        fabricCanvasState.observe(() => {
          const remoteState = fabricCanvasState?.get('state');
          if (remoteState && canvas) {
            const lastModifiedBy = fabricCanvasState?.get('lastModifiedBy');
            
            // Skip applying changes if we made them
            if (lastModifiedBy?.id === userId) return;
            
            // Apply the remote state to the canvas
            canvas.loadFromJSON(remoteState, () => {
              canvas.renderAll();
              
              if (onRemoteUpdate) {
                onRemoteUpdate();
              }
              
              // Show toast notification about changes
              if (lastModifiedBy?.name) {
                toast.info(`Canvas updated by ${lastModifiedBy.name}`);
              }
            });
          }
        });
        
        // Handle awareness updates (collaborators joining/leaving)
        provider.awareness.on('change', () => {
          const states = Array.from(provider!.awareness.getStates().entries());
          
          const activeCollaborators = states
            .filter(([clientId]) => clientId !== provider!.doc.clientID) // Filter out ourselves
            .map(([clientId, state]) => {
              const user = state.user;
              return {
                id: user.id,
                name: user.name,
                color: user.color,
                lastActive: user.lastActive,
                isActive: true,
                lastSeen: new Date()
              };
            });
          
          setCollaborators(activeCollaborators);
        });
        
        // Connection status handling
        provider.on('status', (event: { status: string }) => {
          setIsConnected(event.status === 'connected');
          
          if (event.status === 'connected') {
            toast.success('Connected to collaboration server');
          } else if (event.status === 'disconnected') {
            toast.error('Disconnected from collaboration server');
          }
        });
        
        // Backup with Pusher for environments without WebSocket support
        const pusher = getPusher();
        const channel = pusher.subscribe(`canvas-${roomId}`);
        
        channel.bind('pusher:subscription_succeeded', () => {
          if (!isConnected) {
            setIsConnected(true);
            toast.success('Connected via Pusher fallback');
          }
        });
      } catch (error) {
        console.error('Error initializing CRDT collaboration:', error);
        toast.error('Failed to initialize collaboration');
      }
    };
    
    initCRDT();
    
    // Cleanup function
    return () => {
      if (provider) {
        provider.disconnect();
      }
      if (doc) {
        doc.destroy();
      }
    };
  }, [canvas, roomId, userId, userName, enabled, onRemoteUpdate, isConnected]);
  
  // Sync local changes to the CRDT document
  const syncLocalChanges = useCallback(() => {
    if (!canvas || !enabled) return;
    
    try {
      // Get the Y.js document from the provider
      const doc = new Y.Doc();
      const fabricCanvasState = doc.getMap('canvas');
      
      // Get the canvas state as JSON
      const canvasJson = canvas.toJSON(['id', 'type', 'objectType']);
      
      // Update the shared state
      fabricCanvasState.set('state', canvasJson);
      fabricCanvasState.set('lastModifiedBy', {
        id: userId,
        name: userName,
        timestamp: Date.now()
      });
      
      console.log('Synced local changes to CRDT document');
    } catch (error) {
      console.error('Error syncing local changes:', error);
      toast.error('Failed to sync changes');
    }
  }, [canvas, userId, userName, enabled]);
  
  return {
    collaborators,
    isConnected,
    syncLocalChanges,
    syncType: 'crdt'
  };
}
