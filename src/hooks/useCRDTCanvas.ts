
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useRef, useEffect, useCallback } from 'react';
import logger from '@/utils/logger';

interface UseCRDTCanvasProps {
  canvas: FabricCanvas | null;
  roomId?: string;
  userId: string;
  userName: string;
  enabled?: boolean;
}

export const useCRDTCanvas = ({
  canvas,
  roomId = 'default-room',
  userId,
  userName,
  enabled = true
}: UseCRDTCanvasProps) => {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const canvasMapRef = useRef<Y.Map<any> | null>(null);

  // Initialize CRDT document and connection
  useEffect(() => {
    if (!enabled || !canvas) return;

    try {
      // Create Yjs document
      const doc = new Y.Doc();
      docRef.current = doc;

      // Create WebSocket provider for sync
      const wsProvider = new WebsocketProvider(
        'wss://demos.yjs.dev', // Replace with your WebSocket server
        `canvas-${roomId}`,
        doc,
        { connect: true }
      );

      providerRef.current = wsProvider;

      // Get shared map for canvas state
      const canvasMap = doc.getMap('canvas');
      canvasMapRef.current = canvasMap;

      // Handle remote updates
      canvasMap.observe(() => {
        applyRemoteChanges();
      });

      // Handle connection status
      wsProvider.on('status', ({ status }: { status: string }) => {
        if (status === 'connected') {
          toast.success('Connected to collaboration server');
        } else if (status === 'disconnected') {
          toast.error('Disconnected from collaboration server');
        }
      });

      return () => {
        wsProvider.disconnect();
        doc.destroy();
      };
    } catch (error) {
      logger.error('Error initializing CRDT:', error);
      toast.error('Failed to initialize collaboration');
    }
  }, [enabled, canvas, roomId]);

  // Apply remote changes to canvas
  const applyRemoteChanges = useCallback(() => {
    if (!canvas || !canvasMapRef.current) return;

    try {
      const remoteState = canvasMapRef.current.get('state');
      if (!remoteState) return;

      const parsedState = JSON.parse(remoteState);
      canvas.loadFromJSON(parsedState, () => {
        canvas.renderAll();
        logger.debug('Applied remote canvas changes');
      });
    } catch (error) {
      logger.error('Error applying remote changes:', error);
    }
  }, [canvas]);

  // Sync local changes to CRDT document
  const syncLocalChanges = useCallback(() => {
    if (!canvas || !canvasMapRef.current) return;

    try {
      const currentState = canvas.toJSON(['id', 'type', 'objectType']);
      canvasMapRef.current.set('state', JSON.stringify(currentState));
      canvasMapRef.current.set('lastModifiedBy', {
        id: userId,
        name: userName,
        timestamp: Date.now()
      });

      logger.debug('Synced local changes to CRDT');
    } catch (error) {
      logger.error('Error syncing local changes:', error);
    }
  }, [canvas, userId, userName]);

  return {
    isConnected: providerRef.current?.wsconnected || false,
    syncLocalChanges
  };
};
