
/**
 * Custom hook for Supabase floor plan storage
 * Handles saving and loading floor plans from Supabase
 * @module useSupabaseFloorPlans
 */
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FloorPlan } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";

/**
 * Hook for managing floor plans with Supabase storage
 * @returns Supabase floor plan operations
 */
export const useSupabaseFloorPlans = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const isConfigured = isSupabaseConfigured();

  /**
   * Save floor plans to Supabase
   * @param floorPlans The floor plans to save
   * @returns Promise resolving to success status
   */
  const saveToSupabase = useCallback(async (floorPlans: FloorPlan[]): Promise<boolean> => {
    // Skip if Supabase is not configured
    if (!isConfigured) {
      logger.info('Not saving to Supabase: Missing configuration');
      return false;
    }
    
    // Skip if user is not logged in
    if (!user) {
      logger.info('Not saving to Supabase: User not logged in');
      return false;
    }

    try {
      setIsSaving(true);
      logger.info('Saving floor plans to Supabase');

      // Check for existing floor plans in Supabase
      const { data: existingPlans, error: queryError } = await supabase
        .from('floor_plans')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      const saveData = {
        user_id: user.id,
        name: 'My Floor Plan',
        data: floorPlans
      };

      let result;

      if (existingPlans) {
        // Update existing floor plans
        result = await supabase
          .from('floor_plans')
          .update({
            data: floorPlans,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new floor plans
        result = await supabase
          .from('floor_plans')
          .insert(saveData);
      }

      if (result.error) {
        throw result.error;
      }

      logger.info('Floor plans saved to Supabase successfully');
      return true;
    } catch (error) {
      logger.error('Error saving floor plans to Supabase:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, isConfigured]);

  /**
   * Load floor plans from Supabase
   * @returns Promise resolving to loaded floor plans or null if not found
   */
  const loadFromSupabase = useCallback(async (): Promise<FloorPlan[] | null> => {
    // Skip if Supabase is not configured
    if (!isConfigured) {
      logger.info('Not loading from Supabase: Missing configuration');
      return null;
    }
    
    // Skip if user is not logged in
    if (!user) {
      logger.info('Not loading from Supabase: User not logged in');
      return null;
    }

    try {
      logger.info('Loading floor plans from Supabase');
      
      const { data, error } = await supabase
        .from('floor_plans')
        .select('data')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No records found
          logger.info('No floor plans found in Supabase for user');
          return null;
        }
        throw error;
      }

      if (data && Array.isArray(data.data)) {
        logger.info('Floor plans loaded from Supabase successfully');
        return data.data as FloorPlan[];
      }
      
      return null;
    } catch (error) {
      logger.error('Error loading floor plans from Supabase:', error);
      toast.error('Failed to load floor plans from cloud');
      return null;
    }
  }, [user, isConfigured]);

  return {
    saveToSupabase,
    loadFromSupabase,
    isSaving,
    isLoggedIn: !!user && isConfigured
  };
};
