
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyListItem } from '@/types/propertyTypes';
import { toast } from 'sonner';

/**
 * Hook for property management operations
 */
export const usePropertyManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * List properties for the current user
   * @returns Array of properties or empty array
   */
  const listProperties = async (): Promise<PropertyListItem[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        toast.error('User must be authenticated');
        return [];
      }
      
      console.log('Fetching properties for user:', user?.id);
      
      // In a real implementation, this would call Supabase
      // For now, returning mock data
      return [
        {
          id: 'property-1',
          address: '123 Main St, Anytown, USA',
          status: 'completed' as any,
          updatedAt: new Date().toISOString(),
          client_name: 'John Doe',
          order_id: 'ORD-12345',
          branch_name: 'Main Branch' // Add branch_name for PropertyDetailContent
        },
        {
          id: 'property-2',
          address: '456 Oak Ave, Somewhere, USA',
          status: 'draft' as any,
          updatedAt: new Date().toISOString(),
          client_name: 'Jane Smith',
          order_id: 'ORD-67890',
          branch_name: 'Secondary Branch' // Add branch_name for PropertyDetailContent
        }
      ];
    } catch (err) {
      console.error('Error listing properties:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get property by ID
   * @param propertyId Property ID
   * @returns Property or null
   */
  const getProperty = async (propertyId: string): Promise<PropertyListItem | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        toast.error('User must be authenticated');
        return null;
      }
      
      // In a real implementation, this would use supabase client to fetch floor plans
      // For demonstration, return mock data
      return {
        id: propertyId,
        address: '123 Main St, Anytown, USA',
        status: 'completed' as any,
        updatedAt: new Date().toISOString(),
        client_name: 'John Doe',
        order_id: 'ORD-12345',
        branch_name: 'Main Branch' // Add branch_name for PropertyDetailContent
      };
    } catch (err) {
      console.error('Error getting property:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    listProperties,
    getProperty
  };
};
