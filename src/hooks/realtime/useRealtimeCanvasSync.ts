
/**
 * Hook for real-time canvas synchronization
 * @module hooks/realtime/useRealtimeCanvasSync
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { RealtimeCanvasSyncResult } from '@/utils/realtime/types';
import { createFloorPlanDataForSync, setupRealtimeSync } from '@/utils/realtime/syncUtils';
import { broadcastFloorPlanUpdate, notifyPresenceChange } from '@/utils/syncService';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseRealtimeCanvasSyncProps {
  /** Canvas instance to synchronize */
  canvas: FabricCanvas | null;
  
  /** Whether synchronization is enabled */
  enabled: boolean;
  
  /** Callback when remote updates are received */
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
}

/**
 * Hook for real-time canvas synchronization
 * Handles bidirectional sync between canvas instances
 */
export const useRealtimeCanvasSync = ({
  canvas,
  enabled,
  onRemoteUpdate
}: UseRealtimeCanvasSyncProps): RealtimeCanvasSyncResult => {
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [collaborators, setCollaborators] = useState<number>(0);
  const lastSyncTimeRef = useRef<number>(0);
  const channelRef = useRef<any>(null);
  
  // Update ref when state changes to ensure callbacks have access to latest value
  useEffect(() => {
    lastSyncTimeRef.current = lastSyncTime;
  }, [lastSyncTime]);
  
  // Set up the real-time sync when enabled and canvas is available
  useEffect(() => {
    if (!enabled || !canvas) {
      // Clean up any existing subscription
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      return;
    }
    
    try {
      // Set up real-time sync
      logger.info('Setting up real-time canvas sync');
      const channel = setupRealtimeSync(
        canvas,
        lastSyncTimeRef,
        setLastSyncTime,
        setCollaborators,
        onRemoteUpdate
      );
      
      // Store the channel for cleanup
      channelRef.current = channel;
      
      // Notify about presence
      notifyPresenceChange();
      
      // Cleanup function
      return () => {
        if (channel) {
          channel.unsubscribe();
          channelRef.current = null;
        }
      };
    } catch (error) {
      logger.error('Error setting up real-time sync:', error);
      toast.error('Failed to connect to real-time sync service');
      return () => {};
    }
  }, [canvas, enabled, onRemoteUpdate]);
  
  // Sync canvas data to other users
  const syncCanvas = useCallback((userName: string) => {
    if (!enabled || !canvas) {
      return;
    }
    
    try {
      // Create floor plan data for sync
      const floorPlans = createFloorPlanDataForSync(canvas, userName);
      
      // Update last sync time
      const currentTime = Date.now();
      setLastSyncTime(currentTime);
      lastSyncTimeRef.current = currentTime;
      
      // Broadcast the update
      broadcastFloorPlanUpdate(floorPlans, userName);
      
      logger.info(`Canvas synced by ${userName} at ${new Date(currentTime).toISOString()}`);
    } catch (error) {
      logger.error('Error syncing canvas:', error);
      toast.error('Failed to sync canvas changes');
    }
  }, [canvas, enabled]);
  
  return {
    lastSyncTime,
    collaborators,
    syncCanvas
  };
};
