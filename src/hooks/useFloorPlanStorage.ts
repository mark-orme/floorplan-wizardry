
/**
 * Custom hook for floor plan data storage and auto-saving
 * Combines local storage with Supabase cloud storage
 * @module useFloorPlanStorage
 */
import { useCallback, useEffect, useState } from "react";
import { useSyncedFloorPlans } from "./useSyncedFloorPlans";
import { useSupabaseFloorPlans } from "./useSupabaseFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import logger from "@/utils/logger";

/**
 * Hook that handles the storage and auto-saving of floor plans
 * Now with cross-device synchronization and cloud storage
 */
export const useFloorPlanStorage = () => {
  // Use the synchronized floor plans system with Supabase integration
  const { floorPlans, setFloorPlans, isLoading, loadData } = useSyncedFloorPlans();
  // Use Supabase floor plan storage
  const { saveToSupabase, loadFromSupabase, isSaving, isLoggedIn } = useSupabaseFloorPlans();
  const { user } = useAuth();

  // Track last saved timestamp
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save to Supabase when floor plans change (if user is logged in)
  useEffect(() => {
    if (!floorPlans.length || !isLoggedIn || isSaving) return;
    
    // Skip auto-save if we're still loading
    if (isLoading) return;
    
    const autoSaveTimer = setTimeout(async () => {
      logger.info("Auto-saving floor plans to Supabase");
      const success = await saveToSupabase(floorPlans);
      
      if (success) {
        setLastSaved(new Date());
      }
    }, 3000); // 3-second debounce
    
    return () => clearTimeout(autoSaveTimer);
  }, [floorPlans, isSaving, isLoggedIn, isLoading, saveToSupabase]);
  
  // Load from Supabase when user logs in
  useEffect(() => {
    const loadCloudData = async () => {
      if (user && isLoggedIn) {
        logger.info("User logged in, loading floor plans from Supabase");
        const cloudPlans = await loadFromSupabase();
        
        if (cloudPlans && cloudPlans.length > 0) {
          setFloorPlans(cloudPlans);
          toast.success("Loaded floor plans from cloud");
        }
      }
    };
    
    loadCloudData();
  }, [user, isLoggedIn, loadFromSupabase, setFloorPlans]);

  return { 
    floorPlans,
    setFloorPlans,
    isLoading,
    loadData,
    isSaving,
    isLoggedIn,
    lastSaved
  };
};
