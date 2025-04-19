
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCRDTSync } from '../useCRDTSync';
import logger from '@/utils/logger';

// Collaborator colors
const COLLABORATOR_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
  '#33FFF0', '#F0FF33', '#FF8033', '#8033FF', '#33FF80'
];

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
  onRemoteUpdate?: () => void;
}

export function useRealtimeCanvasSync({
  canvas,
  enabled = true,
  userName = 'Anonymous',
  onRemoteUpdate
}: UseRealtimeCanvasSyncProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const userIdRef = useRef<string>(`user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  const { isConnected, syncLocalChanges } = useCRDTSync({
    canvas,
    userId: userIdRef.current,
    userName,
    enabled
  });

  useEffect(() => {
    if (!canvas || !enabled) return;

    const handleObjectModified = () => {
      syncLocalChanges();
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
    };
  }, [canvas, enabled, syncLocalChanges]);

  return {
    collaborators,
    syncCanvas: syncLocalChanges,
    isConnected
  };
}
