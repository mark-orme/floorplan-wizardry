
/**
 * Hook for real-time canvas synchronization
 * This is a wrapper that selects between CRDT or basic sync based on feature flags
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { isFeatureEnabled } from '@/utils/dynamicImport';
import { useRealtimeCRDTSync } from './useRealtimeCRDTSync';
import { useRealtimeCanvasSync } from './realtime/useRealtimeCanvasSync';
import { toast } from 'sonner';

export interface RealtimeSyncProps {
  canvas: FabricCanvas | null;
  roomId?: string;
  userId: string;
  userName?: string;
  enabled?: boolean;
  onRemoteUpdate?: () => void;
}

export function useRealtimeSync({
  canvas,
  roomId = 'default-room',
  userId,
  userName = 'Anonymous',
  enabled = true,
  onRemoteUpdate
}: RealtimeSyncProps) {
  // Determine which sync implementation to use based on feature flags
  const useCRDT = isFeatureEnabled('enableCollaboration');
  
  // CRDT-based sync (conflict-free)
  const crdtSync = useRealtimeCRDTSync({
    canvas,
    roomId,
    userId,
    userName,
    enabled: enabled && useCRDT,
    onRemoteUpdate
  });
  
  // Simple last-write-wins sync
  const simpleSync = useRealtimeCanvasSync({
    canvas,
    enabled: enabled && !useCRDT,
    userName,
    onRemoteUpdate
  });
  
  // Show a notification about the sync type on first render
  useEffect(() => {
    if (enabled) {
      if (useCRDT) {
        toast.info('Using CRDT-based collaboration (conflict-free)', {
          id: 'sync-mode',
          duration: 3000
        });
      } else {
        toast.info('Using simple last-write-wins collaboration', {
          id: 'sync-mode',
          duration: 3000
        });
      }
    }
  }, [enabled, useCRDT]);
  
  // Create a common interface regardless of which implementation is used
  const syncLocalChanges = useCallback(() => {
    if (useCRDT) {
      crdtSync.syncLocalChanges();
    } else {
      simpleSync.syncCanvas();
    }
  }, [useCRDT, crdtSync, simpleSync]);
  
  return {
    collaborators: useCRDT ? crdtSync.collaborators : simpleSync.collaborators,
    isConnected: useCRDT ? crdtSync.isConnected : simpleSync.isConnected,
    syncLocalChanges,
    syncType: useCRDT ? 'crdt' : 'simple'
  };
}
