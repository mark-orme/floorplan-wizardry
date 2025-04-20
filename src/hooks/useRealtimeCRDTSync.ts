/**
 * Real-time synchronization hook using CRDT (Conflict-free Replicated Data Type)
 * This enables robust multi-user, offline-first collaboration.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as Automerge from '@automerge/automerge';
import { toast } from 'sonner';
import { getPusher } from '@/utils/pusher';
import logger from '@/utils/logger';

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
  roomId?: string;
  userId: string;
  userName?: string;
  enabled?: boolean;
  onRemoteUpdate?: () => void;
}

export function useRealtimeCRDTSync({
  canvas,
  roomId = 'default-room',
  userId,
  userName = 'Anonymous',
  enabled = true,
  onRemoteUpdate
}: UseRealtimeCRDTSyncProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const documentRef = useRef<Automerge.Doc<any> | null>(null);
  const channelRef = useRef<any>(null);
  const lastSyncedStateRef = useRef<string | null>(null);

  // Initialize document and subscription
  useEffect(() => {
    if (!enabled || !canvas) return;

    try {
      // Create or initialize Automerge document
      let doc = Automerge.init();
      
      // Set initial document state
      doc = Automerge.change(doc, 'Initialize canvas', doc => {
        doc.canvas = {
          objects: [],
          lastModifiedBy: { id: userId, name: userName },
          lastModified: Date.now()
        };
      });
      documentRef.current = doc;

      // Connect to Pusher
      const pusher = getPusher();
      const channel = pusher.subscribe(`crdt-${roomId}`);
      channelRef.current = channel;

      // Handle incoming updates
      channel.bind('client-crdt-update', (data: any) => {
        if (data.senderId === userId) return; // Ignore own updates
        handleIncomingChanges(data.changes);
      });

      // Handle connection status
      channel.bind('pusher:subscription_succeeded', () => {
        setIsConnected(true);
        toast.success('Connected to collaboration server');
        
        // Announce presence
        announcePresence();
      });

      channel.bind('pusher:subscription_error', () => {
        setIsConnected(false);
        toast.error('Failed to connect to collaboration server');
      });

      // Handle presence updates
      channel.bind('client-presence', (data: any) => {
        handlePresenceUpdate(data);
      });

      // Set up cleanup
      return () => {
        if (channel) {
          channel.unbind_all();
          pusher.unsubscribe(`crdt-${roomId}`);
        }
      };
    } catch (error) {
      logger.error('Error initializing CRDT:', error);
      toast.error('Failed to initialize collaboration');
    }
  }, [enabled, canvas, roomId, userId, userName]);

  // Handle incoming CRDT changes
  const handleIncomingChanges = useCallback((changes: Uint8Array) => {
    if (!documentRef.current || !canvas) return;
    
    try {
      // Apply incoming changes to the local document
      const updatedDoc = Automerge.merge(
        documentRef.current,
        Automerge.load(changes)
      );
      documentRef.current = updatedDoc;
      
      // Apply changes to canvas
      if (updatedDoc.canvas?.objects) {
        // Only update if state has changed
        const stateJson = JSON.stringify(updatedDoc.canvas.objects);
        if (stateJson !== lastSyncedStateRef.current) {
          canvas.loadFromJSON({ objects: updatedDoc.canvas.objects }, () => {
            canvas.renderAll();
            lastSyncedStateRef.current = stateJson;
            if (onRemoteUpdate) onRemoteUpdate();
            logger.debug('Applied remote CRDT changes');
          });
        }
      }
    } catch (error) {
      logger.error('Error applying CRDT changes:', error);
    }
  }, [canvas, onRemoteUpdate]);

  // Handle presence updates
  const handlePresenceUpdate = useCallback((data: any) => {
    if (!data || !data.presence) return;
    
    setCollaborators(current => {
      // Update existing collaborator or add new one
      const updated = [...current];
      const index = updated.findIndex(c => c.id === data.presence.id);
      
      const collaborator: Collaborator = {
        id: data.presence.id,
        name: data.presence.name || 'Anonymous',
        color: data.presence.color || '#' + Math.floor(Math.random()*16777215).toString(16),
        lastActive: Date.now(),
        isActive: true,
        lastSeen: new Date()
      };
      
      if (index >= 0) {
        updated[index] = collaborator;
      } else {
        updated.push(collaborator);
      }
      
      // Filter out inactive collaborators (inactive for more than 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      return updated.filter(c => c.lastActive > fiveMinutesAgo);
    });
  }, []);

  // Announce presence to other users
  const announcePresence = useCallback(() => {
    if (!channelRef.current) return;
    
    try {
      // Generate a consistent color for this user
      const userColor = '#' + 
        (parseInt(userId.slice(0, 8), 36) % 16777215).toString(16).padStart(6, '0');
      
      channelRef.current.trigger('client-presence', {
        presence: {
          id: userId,
          name: userName,
          color: userColor,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      logger.error('Error announcing presence:', error);
    }
  }, [userId, userName]);

  // Sync local changes to CRDT
  const syncLocalChanges = useCallback(() => {
    if (!canvas || !documentRef.current || !channelRef.current) return;

    try {
      // Get current canvas state
      const currentState = canvas.toJSON(['id', 'type', 'objectType']);
      const stateJson = JSON.stringify(currentState.objects);
      
      // Only update if state has changed
      if (stateJson === lastSyncedStateRef.current) return;
      
      // Update local document
      const updatedDoc = Automerge.change(documentRef.current, 'Update canvas', doc => {
        doc.canvas = {
          objects: currentState.objects,
          lastModifiedBy: { id: userId, name: userName },
          lastModified: Date.now()
        };
      });
      
      // Get binary changes to send
      const changes = Automerge.save(updatedDoc);
      documentRef.current = updatedDoc;
      lastSyncedStateRef.current = stateJson;
      
      // Send changes to other users
      channelRef.current.trigger('client-crdt-update', {
        senderId: userId,
        changes,
        timestamp: Date.now()
      });
      
      // Also announce presence with each update
      announcePresence();
      
      logger.debug('Synced local changes via CRDT');
    } catch (error) {
      logger.error('Error syncing local changes:', error);
    }
  }, [canvas, userId, userName, announcePresence]);

  // Set up heartbeat to keep collaborator list updated
  useEffect(() => {
    if (!enabled || !isConnected) return;
    
    const heartbeatInterval = setInterval(() => {
      announcePresence();
    }, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [enabled, isConnected, announcePresence]);

  return {
    collaborators,
    isConnected,
    syncLocalChanges,
    announcePresence
  };
}
