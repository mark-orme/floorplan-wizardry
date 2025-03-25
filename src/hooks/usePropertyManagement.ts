import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyListItem, PropertyStatus } from '@/types/propertyTypes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/floorPlanTypes';

export const usePropertyManagement = () => {
  const [authContextError, setAuthContextError] = useState(false);
  let authData = { user: null, userRole: null };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error in usePropertyManagement:', error);
    setAuthContextError(true);
  }
  
  const { user, userRole } = authData;
  
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const createProperty = useCallback(async (
    orderID: string,
    address: string,
    clientName: string,
    branchName: string = '',
    floorPlans: FloorPlan[] = []
  ): Promise<Property | null> => {
    if (authContextError) {
      toast.error('Authentication error. Please refresh the page and try again.');
      return null;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a property');
      return null;
    }

    setIsLoading(true);

    try {
      const newProperty: Omit<Property, 'id'> = {
        order_id: orderID,
        address,
        client_name: clientName,
        branch_name: branchName,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: PropertyStatus.DRAFT,
        floor_plans: floorPlans
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
  }, [user, authContextError]);

  const listProperties = useCallback(async (): Promise<PropertyListItem[]> => {
    if (authContextError) {
      console.error("Auth context error, cannot list properties");
      return [];
    }
    
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
  }, [user, userRole, authContextError]);

  const getProperty = useCallback(async (id: string): Promise<Property | null> => {
    if (authContextError) {
      console.error("Auth context error, cannot get property");
      return null;
    }
    
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
  }, [user, authContextError]);

  const updateProperty = useCallback(async (
    id: string,
    updates: Partial<Property>
  ): Promise<Property | null> => {
    if (authContextError) {
      toast.error('Authentication error. Please refresh the page and try again.');
      return null;
    }
    
    if (!user) return null;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Property updated successfully');
      setCurrentProperty(data as Property);
      return data as Property;
    } catch (error: any) {
      toast.error(error.message || 'Error updating property');
      console.error('Error updating property:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, authContextError]);

  const updatePropertyStatus = useCallback(async (
    id: string,
    status: PropertyStatus
  ): Promise<boolean> => {
    if (authContextError) {
      toast.error('Authentication error. Please refresh the page and try again.');
      return false;
    }
    
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Property marked as ${status}`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error updating property status');
      console.error('Error updating property status:', error);
      return false;
    }
  }, [user, authContextError]);

  const saveFloorPlans = useCallback(async (
    propertyId: string,
    floorPlans: FloorPlan[]
  ): Promise<boolean> => {
    if (authContextError) {
      toast.error('Authentication error. Please refresh the page and try again.');
      return false;
    }
    
    if (!user) return false;

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
  }, [user, authContextError]);

  return {
    properties,
    currentProperty,
    isLoading,
    createProperty,
    listProperties,
    getProperty,
    updateProperty,
    updatePropertyStatus,
    saveFloorPlans
  };
};
