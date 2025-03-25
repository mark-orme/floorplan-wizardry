
/**
 * Custom hook for synchronized floor plans across devices
 * @module useSyncedFloorPlans
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Channel } from 'pusher-js';
import { FloorPlan } from '@/types/floorPlanTypes';
import { loadFloorPlans, saveFloorPlans } from '@/utils/floorPlanStorage';
import { subscribeSyncChannel, broadcastFloorPlanUpdate, isUpdateFromThisDevice } from '@/utils/syncService';
import logger from '@/utils/logger';

/**
 * Hook for managing floor plans with real-time sync across devices
 * @returns Synchronized floor plans state and operations
 */
export const useSyncedFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncChannel, setSyncChannel] = useState<Channel | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Initialize sync channel
  useEffect(() => {
    const channel = subscribeSyncChannel();
    setSyncChannel(channel);

    return () => {
      if (channel) {
        channel.unbind_all();
      }
    };
  }, []);

  // Set up sync event listeners
  useEffect(() => {
    if (!syncChannel) return;

    const handleFloorPlanUpdate = (data: any) => {
      // Skip if this update is from this device
      if (isUpdateFromThisDevice(data.deviceId)) {
        logger.info('Ignoring update from this device');
        return;
      }

      // Skip if this update is older than our last sync
      if (data.timestamp <= lastSyncTimeRef.current) {
        logger.info('Ignoring older update');
        return;
      }

      logger.info('Received floor plan update from another device');
      lastSyncTimeRef.current = data.timestamp;

      // Update floor plans and save to local storage
      setFloorPlans(data.floorPlans);
      
      // Save to local storage without broadcasting
      isSavingRef.current = true;
      saveFloorPlans(data.floorPlans).finally(() => {
        isSavingRef.current = false;
      });

      toast.info('Floor plans synchronized from another device');
    };

    // Listen for update events
    syncChannel.bind(`client-update-floorplan`, handleFloorPlanUpdate);

    return () => {
      syncChannel.unbind(`client-update-floorplan`, handleFloorPlanUpdate);
    };
  }, [syncChannel]);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await loadFloorPlans();
      setFloorPlans(data);
      return data;
    } catch (error) {
      logger.error('Error loading floor plans:', error);
      toast.error('Failed to load floor plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-save with debounce and sync across devices
  const saveFloorPlansWithSync = useCallback((newFloorPlans: FloorPlan[]) => {
    setFloorPlans(newFloorPlans);

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      if (isSavingRef.current) {
        return; // Skip if already saving (from a sync event)
      }

      try {
        await saveFloorPlans(newFloorPlans);
        broadcastFloorPlanUpdate(newFloorPlans);
        lastSyncTimeRef.current = Date.now();
        logger.info('Floor plans saved and synced');
      } catch (error) {
        logger.error('Error saving floor plans:', error);
        toast.error('Failed to save floor plans');
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 2000);
  }, []);

  return {
    floorPlans,
    setFloorPlans: saveFloorPlansWithSync,
    isLoading,
    loadData
  };
};
