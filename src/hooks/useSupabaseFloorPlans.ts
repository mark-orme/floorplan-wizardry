
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
import { verifyResourceOwnership } from "@/utils/security/resourceOwnership";
import { logResourceEvent, AuditEventType } from "@/utils/audit/auditLogger";

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
    // Security checks
    if (!isConfigured) {
      logger.info('Not saving to Supabase: Missing configuration');
      return false;
    }
    
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
        .select()
        .eq('user_id', user.id)
        .single();
        
      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      // Authorization check for update operations
      if (existingPlans) {
        const isAuthorized = await verifyResourceOwnership(
          user.id, 
          'floor_plans', 
          existingPlans.id
        );
        
        if (!isAuthorized) {
          logger.warn(`Unauthorized floor plan modification attempt by user ${user.id}`);
          toast.error('Unauthorized: You cannot modify this floor plan');
          return false;
        }
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
          
        // Log the update event
        await logResourceEvent(
          AuditEventType.RESOURCE_UPDATE,
          user.id,
          'floor_plans',
          existingPlans.id,
          'update',
          { planCount: floorPlans.length }
        );
      } else {
        // Insert new floor plans
        result = await supabase
          .from('floor_plans')
          .insert(saveData);
          
        // Log the create event
        const { data } = await supabase
          .from('floor_plans')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          await logResourceEvent(
            AuditEventType.RESOURCE_CREATE,
            user.id,
            'floor_plans',
            data.id,
            'create',
            { planCount: floorPlans.length }
          );
        }
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
    // Security checks
    if (!isConfigured) {
      logger.info('Not loading from Supabase: Missing configuration');
      return null;
    }
    
    if (!user) {
      logger.info('Not loading from Supabase: User not logged in');
      return null;
    }

    try {
      logger.info('Loading floor plans from Supabase');
      
      const { data, error } = await supabase
        .from('floor_plans')
        .select()
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

      // Authorization check - verify the user owns this data
      const isAuthorized = await verifyResourceOwnership(
        user.id, 
        'floor_plans', 
        data.id
      );
      
      if (!isAuthorized) {
        logger.warn(`Unauthorized floor plan access attempt by user ${user.id}`);
        toast.error('Unauthorized: You cannot access this floor plan');
        return null;
      }

      // Log the access event
      await logResourceEvent(
        AuditEventType.RESOURCE_READ,
        user.id,
        'floor_plans',
        data.id,
        'read'
      );

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
