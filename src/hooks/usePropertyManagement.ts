
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyListItem, PropertyStatus } from '@/types/propertyTypes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/floorPlanTypes';

export const usePropertyManagement = () => {
  const { user, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  // Create a new property
  const createProperty = useCallback(async (
    orderID: string,
    address: string,
    clientName: string,
    branchName: string = '',
    floorPlans: FloorPlan[] = []
  ): Promise<Property | null> => {
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
  }, [user]);

  // List properties based on user role
  const listProperties = useCallback(async (): Promise<PropertyListItem[]> => {
    if (!user || !userRole) {
      setProperties([]);
      return [];
    }

    setIsLoading(true);

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

      if (error) throw error;

      setProperties(data as PropertyListItem[]);
      return data as PropertyListItem[];
    } catch (error: any) {
      toast.error(error.message || 'Error loading properties');
      console.error('Error loading properties:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  // Get a property by ID
  const getProperty = useCallback(async (id: string): Promise<Property | null> => {
    if (!user) return null;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setCurrentProperty(data as Property);
      return data as Property;
    } catch (error: any) {
      console.error('Error fetching property:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update a property
  const updateProperty = useCallback(async (
    id: string,
    updates: Partial<Property>
  ): Promise<Property | null> => {
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
  }, [user]);

  // Update property status
  const updatePropertyStatus = useCallback(async (
    id: string,
    status: PropertyStatus
  ): Promise<boolean> => {
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
  }, [user]);

  // Save floor plans for a property
  const saveFloorPlans = useCallback(async (
    propertyId: string,
    floorPlans: FloorPlan[]
  ): Promise<boolean> => {
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
  }, [user]);

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
