
/**
 * Property Floor Plan Hook
 * Handles operations related to floor plans for properties
 * @module property/usePropertyFloorPlan
 */
import { useState } from 'react';
import { FloorPlan } from '@/types/floorPlanTypes';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Hook for managing property floor plans
 * 
 * @returns {Object} Property floor plan state and handlers
 */
export const usePropertyFloorPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Save floor plans for a property
   * 
   * @param {string} propertyId Property ID
   * @param {FloorPlan[]} floorPlans Floor plans to save
   * @returns {Promise<boolean>} Success or failure
   */
  const saveFloorPlans = async (propertyId: string, floorPlans: FloorPlan[]): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Associate floor plans with property
      for (const floorPlan of floorPlans) {
        const { error: updateError } = await supabase
          .from('floor_plans')
          .update({ property_id: propertyId })
          .eq('id', floorPlan.id);
        
        if (updateError) {
          logger.error(`Error associating floor plan ${floorPlan.id} with property:`, updateError);
        }
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save floor plans';
      setError(errorMessage);
      logger.error('Error saving floor plans:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    saveFloorPlans
  };
};
