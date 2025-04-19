
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCRDTSync } from '../useCRDTSync';
import logger from '@/utils/logger';

// Collaborator colors
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
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
}

export function useRealtimeCanvasSync({
  canvas,
  enabled = true,
  userName = 'Anonymous',
  onRemoteUpdate
}: UseRealtimeCanvasSyncProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const userIdRef = useRef<string>(`user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  // Initialize CRDT sync
  const { isConnected, syncLocalChanges } = useCRDTSync({
    canvas,
    userId: userIdRef.current,
    userName,
    enabled
  });
  
  // Handle connection status changes
  useEffect(() => {
    if (isConnected) {
      logger.info('Connected to CRDT collaboration server');
    } else {
      logger.warn('Disconnected from CRDT collaboration server');
    }
  }, [isConnected]);
  
  // Manually trigger sync - accepts an optional parameter for backward compatibility
  const syncCanvas = useCallback((_userName?: string) => {
    if (enabled) {
      syncLocalChanges();
    }
  }, [enabled, syncLocalChanges]);
  
  return { collaborators, syncCanvas };
}
