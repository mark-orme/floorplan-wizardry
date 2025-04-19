
/**
 * Hook for floor plan operations with Supabase
 */
import { useState, useCallback } from "react";
import { FloorPlan, FloorPlanMetadata, PaperSize } from "@/types/floorPlanTypes";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/**
 * Hook that manages floor plan operations with Supabase
 */
export const useSupabaseFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  /**
   * Fetches all floor plans for the current user
   */
  const listFloorPlans = useCallback(async (): Promise<FloorPlan[]> => {
    setIsLoading(true);
    setError("");
    
    try {
      // Get current user
      const authResponse = await supabase.auth.getUser();
      
      if (authResponse.error) {
        throw new Error(authResponse.error.message);
      }
      
      const user = authResponse.data?.user;
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Get floor plans for user
      const response = await supabase
        .from('floor_plans')
        .select('*')
        .eq('user_id', user.id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Transform to FloorPlan objects
      const plans: FloorPlan[] = response.data.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        data: plan.data || {},
        userId: plan.user_id,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        label: plan.name,
        level: 0,
        gia: 0,
        metadata: {
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
          paperSize: PaperSize.A4
        }
      }));
      
      setFloorPlans(plans);
      return plans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch floor plans";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Fetches a single floor plan by ID
   */
  const getFloorPlan = useCallback(async (id: string): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError("");
    
    try {
      // Get floor plan by ID
      const response = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const plan = response.data;
      
      // Transform to FloorPlan object
      const floorPlan: FloorPlan = {
        id: plan.id,
        name: plan.name,
        data: plan.data || {},
        userId: plan.user_id,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        label: plan.name,
        level: 0,
        gia: 0,
        metadata: {
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
          paperSize: PaperSize.A4
        }
      };
      
      setCurrentFloorPlan(floorPlan);
      return floorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch floor plan";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Creates a new floor plan
   */
  const createFloorPlan = useCallback(async (floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError("");
    
    try {
      // Get current user
      const authResponse = await supabase.auth.getUser();
      
      if (authResponse.error) {
        throw new Error(authResponse.error.message);
      }
      
      const user = authResponse.data?.user;
      
      if (!user) {
        throw new Error("No authenticated user found");
      }
      
      // Format data for Supabase
      const now = new Date().toISOString();
      const floorPlanData = {
        name: floorPlan.name || "New Floor Plan",
        data: floorPlan.data || {},
        user_id: user.id,
        created_at: now,
        updated_at: now
      };
      
      // Insert floor plan
      const response = await supabase
        .from('floor_plans')
        .insert([floorPlanData]);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Get the newly created floor plan
      await listFloorPlans();
      
      // Create FloorPlan object
      const newFloorPlan: FloorPlan = {
        id: response.data?.[0]?.id || "",
        name: floorPlanData.name,
        data: floorPlanData.data,
        userId: floorPlanData.user_id,
        createdAt: floorPlanData.created_at,
        updatedAt: floorPlanData.updated_at,
        label: floorPlanData.name,
        level: 0,
        gia: 0,
        metadata: {
          createdAt: floorPlanData.created_at,
          updatedAt: floorPlanData.updated_at,
          paperSize: PaperSize.A4
        }
      };
      
      toast.success("Floor plan created successfully");
      return newFloorPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create floor plan";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [listFloorPlans]);
  
  /**
   * Updates an existing floor plan
   */
  const updateFloorPlan = useCallback(async (id: string, floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError("");
    
    try {
      // Format data for Supabase
      const now = new Date().toISOString();
      const floorPlanData = {
        updated_at: now
      };
      
      // Add other fields if provided
      if (floorPlan.name) floorPlanData['name'] = floorPlan.name;
      if (floorPlan.data) floorPlanData['data'] = floorPlan.data;
      
      // Update floor plan
      const response = await supabase
        .from('floor_plans')
        .update(floorPlanData)
        .eq('id', id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Refresh floor plans
      await listFloorPlans();
      
      toast.success("Floor plan updated successfully");
      
      // Get the updated floor plan
      return getFloorPlan(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update floor plan";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [listFloorPlans, getFloorPlan]);
  
  /**
   * Deletes a floor plan
   */
  const deleteFloorPlan = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    
    try {
      // Delete floor plan
      const response = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Refresh floor plans
      await listFloorPlans();
      
      toast.success("Floor plan deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete floor plan";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [listFloorPlans]);
  
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
};
