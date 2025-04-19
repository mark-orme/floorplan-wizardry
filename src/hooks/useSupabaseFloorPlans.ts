
/**
 * Hook for managing floor plans with Supabase
 * Provides functions for creating, updating, and retrieving floor plans
 */
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FloorPlan } from '@/types/floorPlanTypes';
import logger from '@/utils/logger';

export function useSupabaseFloorPlans() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  
  /**
   * List all floor plans
   * 
   * @returns {Promise<FloorPlan[]>} List of floor plans
   */
  const listFloorPlans = async (): Promise<FloorPlan[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('floor_plans')
        .select()
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching floor plans: ${error.message}`);
      }
      
      const floorPlans = data as FloorPlan[];
      setFloorPlans(floorPlans);
      return floorPlans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error('Error listing floor plans:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get a floor plan by ID
   * 
   * @param {string} id Floor plan ID
   * @returns {Promise<FloorPlan | null>} Floor plan or null if not found
   */
  const getFloorPlan = async (id: string): Promise<FloorPlan | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('floor_plans')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching floor plan: ${error.message}`);
      }
      
      const floorPlan = data as FloorPlan;
      setCurrentFloorPlan(floorPlan);
      return floorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(`Error getting floor plan ${id}:`, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new floor plan
   * 
   * @param {Partial<FloorPlan>} floorPlan Floor plan data
   * @returns {Promise<FloorPlan | null>} Created floor plan or null if failed
   */
  const createFloorPlan = async (floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('floor_plans')
        .insert(floorPlan)
        .select();
      
      if (error) {
        throw new Error(`Error creating floor plan: ${error.message}`);
      }
      
      // Refresh the list of floor plans
      await listFloorPlans();
      
      return data[0] as FloorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error('Error creating floor plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update an existing floor plan
   * 
   * @param {string} id Floor plan ID
   * @param {Partial<FloorPlan>} floorPlan Floor plan data to update
   * @returns {Promise<FloorPlan | null>} Updated floor plan or null if failed
   */
  const updateFloorPlan = async (id: string, floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('floor_plans')
        .update(floorPlan)
        .eq('id', id)
        .select();
      
      if (error) {
        throw new Error(`Error updating floor plan: ${error.message}`);
      }
      
      // Refresh the list of floor plans
      await listFloorPlans();
      
      return data[0] as FloorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(`Error updating floor plan ${id}:`, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a floor plan
   * 
   * @param {string} id Floor plan ID
   * @returns {Promise<boolean>} Success or failure
   */
  const deleteFloorPlan = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting floor plan: ${error.message}`);
      }
      
      // Refresh the list of floor plans
      await listFloorPlans();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(`Error deleting floor plan ${id}:`, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    floorPlans,
    currentFloorPlan,
    listFloorPlans,
    getFloorPlan,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
}
