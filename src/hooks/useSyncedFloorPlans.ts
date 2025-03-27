
/**
 * Custom hook for synchronized floor plans across devices
 * @module useSyncedFloorPlans
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Channel } from 'pusher-js';
import { FloorPlan } from '@/types/floorPlanTypes';
import { loadFloorPlans, saveFloorPlans } from '@/utils/floorPlanStorage';
import { 
  subscribeSyncChannel, 
  broadcastFloorPlanUpdate, 
  isUpdateFromThisDevice,
  SYNC_CHANNEL,
  UPDATE_EVENT
} from '@/utils/syncService';
import { useSupabaseFloorPlans } from './useSupabaseFloorPlans';
import logger from '@/utils/logger';

/**
 * Hook for managing floor plans with real-time sync across devices
 * and Supabase cloud storage
 * 
 * @returns {Object} Synchronized floor plans state and operations
 */
export const useSyncedFloorPlans = () => {
  /**
   * State for floor plans data
   */
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  /**
   * Loading state indicator
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /**
   * Pusher sync channel instance
   */
  const [syncChannel, setSyncChannel] = useState<Channel | null>(null);
  /**
   * Reference to track last sync timestamp
   */
  const lastSyncTimeRef = useRef<number>(0);
  /**
   * Reference to track if currently saving
   */
  const isSavingRef = useRef<boolean>(false);
  /**
   * Reference to track save timeout
   */
  const saveTimeoutRef = useRef<number | null>(null);
  /**
   * Reference to track Supabase save timeout
   */
  const supabaseSaveTimeoutRef = useRef<number | null>(null);

  // Initialize Supabase floor plans
  const { saveToSupabase, loadFromSupabase, isLoggedIn } = useSupabaseFloorPlans();

  /**
   * Initialize sync channel on component mount
   */
  useEffect(() => {
    const channel = subscribeSyncChannel();
    setSyncChannel(channel);

    return () => {
      if (channel) {
        channel.unbind_all();
      }
    };
  }, []);

  /**
   * Set up sync event listeners for real-time updates
   */
  useEffect(() => {
    if (!syncChannel) return;

    /**
     * Handler for floor plan updates from other devices
     * @param {any} data - The update data received from Pusher
     */
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

      // Also save to Supabase if logged in
      if (isLoggedIn) {
        saveToSupabase(data.floorPlans);
      }

      toast.info('Floor plans synchronized from another device');
    };

    // Listen for update events
    syncChannel.bind(`client-${UPDATE_EVENT}`, handleFloorPlanUpdate);

    return () => {
      syncChannel.unbind(`client-${UPDATE_EVENT}`, handleFloorPlanUpdate);
    };
  }, [syncChannel, saveToSupabase, isLoggedIn]);

  /**
   * Load initial floor plan data from Supabase or local storage
   * @returns {Promise<FloorPlan[]>} The loaded floor plans
   */
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First try to load from Supabase if logged in
      let data: FloorPlan[] | null = null;
      
      if (isLoggedIn) {
        data = await loadFromSupabase();
        if (data) {
          logger.info('Loaded floor plans from Supabase');
          setFloorPlans(data);
          // Also save to local storage for offline access
          await saveFloorPlans(data);
          setIsLoading(false);
          return data;
        }
      }
      
      // If not logged in or no Supabase data, fall back to local storage
      logger.info('Falling back to local storage for floor plans');
      data = await loadFloorPlans();
      setFloorPlans(data);
      
      // If logged in and we loaded from local storage, save to Supabase
      if (isLoggedIn && data && data.length > 0) {
        await saveToSupabase(data);
      }
      
      return data;
    } catch (error) {
      logger.error('Error loading floor plans:', error);
      toast.error('Failed to load floor plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, loadFromSupabase]);

  /**
   * Save floor plans with debouncing and multi-device synchronization
   * Updates local state, persists to storage, and broadcasts to other devices
   * 
   * @param {FloorPlan[]} newFloorPlans - The floor plans to save
   */
  const saveFloorPlansWithSync = useCallback((newFloorPlans: FloorPlan[]) => {
    setFloorPlans(newFloorPlans);

    // Clear any existing save timeout
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    // Set a new save timeout (local storage + Pusher)
    saveTimeoutRef.current = window.setTimeout(async () => {
      if (isSavingRef.current) {
        return; // Skip if already saving (from a sync event)
      }

      try {
        await saveFloorPlans(newFloorPlans);
        broadcastFloorPlanUpdate(newFloorPlans);
        lastSyncTimeRef.current = Date.now();
        logger.info('Floor plans saved locally and synced via Pusher');
      } catch (error) {
        logger.error('Error saving floor plans locally:', error);
        toast.error('Failed to save floor plans locally');
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 2000);

    // Clear any existing Supabase save timeout
    if (supabaseSaveTimeoutRef.current !== null) {
      window.clearTimeout(supabaseSaveTimeoutRef.current);
    }

    // Also save to Supabase with a longer debounce if logged in
    if (isLoggedIn) {
      supabaseSaveTimeoutRef.current = window.setTimeout(async () => {
        try {
          const success = await saveToSupabase(newFloorPlans);
          if (success) {
            logger.info('Floor plans saved to Supabase');
          }
        } catch (error) {
          logger.error('Error saving floor plans to Supabase:', error);
        } finally {
          supabaseSaveTimeoutRef.current = null;
        }
      }, 5000); // Longer debounce for Supabase to reduce API calls
    }
  }, [saveToSupabase, isLoggedIn]);

  return {
    floorPlans,
    setFloorPlans: saveFloorPlansWithSync,
    isLoading,
    loadData
  };
};
