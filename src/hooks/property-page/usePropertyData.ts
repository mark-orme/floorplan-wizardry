
import { useState } from 'react';
import { PropertyListItem } from '@/types/property-types';
import { toast } from 'sonner';

/**
 * Hook for managing property data
 */
export const usePropertyData = () => {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch properties
  const refreshProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would normally fetch from an API
      const response = await Promise.resolve([]);
      setProperties(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Failed to fetch properties: ${errorMessage}`));
      toast.error(`Failed to fetch properties: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Add property
  const addProperty = (property: Omit<PropertyListItem, "id" | "updated_at" | "created_at">) => {
    const newProperty = {
      ...property,
      id: `property-${Date.now()}`,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    } as PropertyListItem;
    
    setProperties([...properties, newProperty]);
    toast.success(`Property "${property.name}" added`);
    
    return newProperty;
  };
  
  // Update property
  const updateProperty = (id: string, updates: Partial<PropertyListItem>) => {
    setProperties(prev => prev.map(property => 
      property.id === id
        ? { ...property, ...updates, updated_at: new Date().toISOString() }
        : property
    ));
    toast.success(`Property updated`);
  };
  
  // Delete property
  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    toast.success(`Property deleted`);
  };
  
  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties
  };
};

export default usePropertyData;
