
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus } from '@/types/propertyTypes';
import { toast } from 'sonner';
import { usePropertyBase } from './usePropertyBase';

/**
 * Hook for property update operations
 */
export const usePropertyUpdate = () => {
  const { user, isLoading, setIsLoading, checkAuthentication } = usePropertyBase();

  /**
   * Update a property
   */
  const updateProperty = useCallback(async (
    id: string,
    updates: Partial<Property>
  ): Promise<Property | null> => {
    if (!checkAuthentication()) return null;

    setIsLoading(true);

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      toast.success('Property updated successfully');
      return data?.[0] as Property;
    } catch (error: any) {
      toast.error(error.message || 'Error updating property');
      console.error('Error updating property:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, checkAuthentication]);

  /**
   * Update property status
   */
  const updatePropertyStatus = useCallback(async (
    id: string,
    status: PropertyStatus
  ): Promise<boolean> => {
    if (!checkAuthentication()) return false;

    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success(`Property marked as ${status}`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error updating property status');
      console.error('Error updating property status:', error);
      return false;
    }
  }, [checkAuthentication]);

  return {
    isLoading,
    updateProperty,
    updatePropertyStatus
  };
};
