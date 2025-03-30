
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus } from '@/types/propertyTypes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';
import { usePropertyBase } from './usePropertyBase';

/**
 * Hook for property creation operations
 */
export const usePropertyCreate = () => {
  // Always call hooks unconditionally at the top level
  const { user, isLoading, setIsLoading, checkAuthentication } = usePropertyBase();

  /**
   * Create a new property
   */
  const createProperty = useCallback(async (
    orderID: string,
    address: string,
    clientName: string,
    branchName: string = '',
    floorPlans: FloorPlan[] = []
  ): Promise<Property | null> => {
    if (!checkAuthentication()) return null;

    setIsLoading(true);

    try {
      const newProperty: Omit<Property, 'id'> = {
        // Required properties from Property interface
        name: address, // Use address as name
        type: 'residential', // Default type
        bedrooms: 0, // Default value
        bathrooms: 0, // Default value
        area: 0, // Default value
        status: PropertyStatus.DRAFT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user!.id,
        
        // Additional properties specific to the application
        order_id: orderID,
        address,
        client_name: clientName,
        branch_name: branchName,
        created_by: user!.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        floorPlans: JSON.stringify(floorPlans)  // Convert FloorPlan array to JSON string
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(newProperty)
        .select()
        .single();

      if (error) throw error;

      toast.success('Property created successfully');
      return data as Property;
    } catch (error: any) {
      toast.error(error.message || 'Error creating property');
      console.error('Error creating property:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, checkAuthentication]);

  return {
    isLoading,
    createProperty
  };
};
