
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyListItem, PropertyStatus } from '@/types/propertyTypes';
import { toast } from 'sonner';
import { usePropertyBase } from './usePropertyBase';
import { UserRole } from '@/lib/supabase';

/**
 * Hook for property query operations (listing and fetching)
 */
export const usePropertyQuery = () => {
  // Always call hooks unconditionally at the top level
  const { user, userRole, isLoading, setIsLoading, checkAuthentication } = usePropertyBase();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  /**
   * List properties with filtering based on user role
   */
  const listProperties = useCallback(async (): Promise<PropertyListItem[]> => {
    if (!user || !userRole) {
      console.log("No user or user role found, returning empty properties array");
      setProperties([]);
      return [];
    }

    setIsLoading(true);
    console.log("Fetching properties for user:", user.id, "with role:", userRole);

    try {
      let query = supabase
        .from('properties')
        .select('id, order_id, address, client_name, status, created_at, updated_at, created_by');

      // Apply filters based on role
      if (userRole === 'photographer') {
        // Photographers can only see their own properties
        query = query.eq('created_by', user.id);
      } else if (userRole === 'processing_manager') {
        // Processing managers can only see properties in review or completed
        query = query.in('status', [PropertyStatus.PENDING_REVIEW, PropertyStatus.COMPLETED]);
      }
      // Managers can see all properties

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error when loading properties:", error);
        throw error;
      }

      console.log("Fetched properties:", data?.length || 0);
      setProperties(data as PropertyListItem[]);
      return data as PropertyListItem[];
    } catch (error: any) {
      toast.error(error.message || 'Error loading properties');
      console.error('Error loading properties:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole, setIsLoading]);

  /**
   * Get a single property by ID
   */
  const getProperty = useCallback(async (id: string): Promise<Property | null> => {
    if (!user) {
      console.warn("No user found when fetching property");
      return null;
    }

    setIsLoading(true);
    console.log("Fetching property with ID:", id);

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Supabase error when fetching property:", error);
        toast.error(error.message || 'Error loading property');
        throw error;
      }

      console.log("Property fetched successfully:", data?.id);
      setCurrentProperty(data as Property);
      return data as Property;
    } catch (error: any) {
      console.error('Error fetching property:', error);
      toast.error(error.message || 'Error loading property');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading]);

  return {
    properties,
    currentProperty,
    isLoading,
    listProperties,
    getProperty
  };
};
