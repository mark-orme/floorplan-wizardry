
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
}

interface UseRealtimeCanvasSyncProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  userName?: string;
  onRemoteUpdate?: () => void;
}

/**
 * Simplified mock for real-time sync - removed complex CRDT functionality
 */
export function useRealtimeCanvasSync({
  canvas,
  enabled = false,
  userName = 'Anonymous'
}: UseRealtimeCanvasSyncProps) {
  const [collaborators] = useState<Collaborator[]>([]);
  const [isConnected] = useState(false);

  const syncLocalChanges = useCallback(() => {
    if (!enabled) return;
    
    if (!isConnected && enabled) {
      toast.info("Real-time collaboration is disabled in this simplified version");
    }
    
    return false;
  }, [enabled, isConnected]);

  return {
    collaborators,
    syncCanvas: syncLocalChanges,
    isConnected: false // Always disabled in simplified version
  };
}
