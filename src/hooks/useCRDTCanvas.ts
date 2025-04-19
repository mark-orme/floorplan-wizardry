
import * as Y from 'yjs';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useRef, useEffect, useCallback } from 'react';
import logger from '@/utils/logger';
import { getPusher } from '@/utils/pusher';

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
  const channelRef = useRef<any>(null);
  const canvasMapRef = useRef<Y.Map<any> | null>(null);

  // Initialize CRDT document and Pusher connection
  useEffect(() => {
    if (!enabled || !canvas) return;

    try {
      // Create Yjs document
      const doc = new Y.Doc();
      docRef.current = doc;

      // Get Pusher instance and subscribe to channel
      const pusher = getPusher();
      const channel = pusher.subscribe(`canvas-${roomId}`);
      channelRef.current = channel;

      // Get shared map for canvas state
      const canvasMap = doc.getMap('canvas');
      canvasMapRef.current = canvasMap;

      // Handle remote updates through Pusher
      channel.bind('client-canvas-update', (data: any) => {
        applyRemoteChanges();
      });

      // Handle connection status through Pusher
      channel.bind('pusher:subscription_succeeded', () => {
        toast.success('Connected to collaboration server');
      });

      channel.bind('pusher:subscription_error', () => {
        toast.error('Failed to connect to collaboration server');
      });

      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`canvas-${roomId}`);
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
    if (!canvas || !canvasMapRef.current || !channelRef.current) return;

    try {
      const currentState = canvas.toJSON(['id', 'type', 'objectType']);
      canvasMapRef.current.set('state', JSON.stringify(currentState));
      canvasMapRef.current.set('lastModifiedBy', {
        id: userId,
        name: userName,
        timestamp: Date.now()
      });

      // Trigger update through Pusher
      channelRef.current.trigger('client-canvas-update', {
        userId,
        userName,
        timestamp: Date.now()
      });

      logger.debug('Synced local changes to CRDT');
    } catch (error) {
      logger.error('Error syncing local changes:', error);
    }
  }, [canvas, userId, userName]);

  return {
    isConnected: channelRef.current?.subscribed || false,
    syncLocalChanges
  };
};
