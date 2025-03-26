
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';
import { usePropertyBase } from './usePropertyBase';

/**
 * Hook for floor plan operations
 */
export const usePropertyFloorPlan = () => {
  const { checkAuthentication } = usePropertyBase();

  /**
   * Save floor plans for a property
   */
  const saveFloorPlans = useCallback(async (
    propertyId: string,
    floorPlans: FloorPlan[]
  ): Promise<boolean> => {
    if (!checkAuthentication()) return false;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          floor_plans: floorPlans,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) throw error;
      
      toast.success('Floor plans saved successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error saving floor plans');
      console.error('Error saving floor plans:', error);
      return false;
    }
  }, [checkAuthentication]);

  return {
    saveFloorPlans
  };
};
