
/**
 * Simplified hook that replaces the complex CRDT functionality
 */
import { useCallback } from 'react';
import { Canvas } from 'fabric';

interface UseCRDTSyncProps {
  canvas: Canvas | null;
  userId: string;
  userName: string;
  enabled?: boolean;
}

export const useCRDTSync = ({ 
  canvas,
  enabled = false
}: UseCRDTSyncProps) => {
  // Simplified version - removed complex CRDT functionality
  
  const syncLocalChanges = useCallback(() => {
    if (!enabled || !canvas) return false;
    
    // Simply log the action, no real sync happens
    console.log("Canvas changes would be synced (disabled in simplified version)");
    return true;
  }, [canvas, enabled]);
  
  return {
    isConnected: false,
    syncLocalChanges
  };
};
