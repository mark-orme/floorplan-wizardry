
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface PropertyListItem {
  id: string;
  name: string;
  address: string;
  status: 'available' | 'sold' | 'pending';
  price: number;
  created_at: string;
  updated_at: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  imageUrl?: string;
}

interface UsePropertyManagementProps {
  initialProperties?: PropertyListItem[];
}

export const usePropertyManagement = ({
  initialProperties = []
}: UsePropertyManagementProps = {}) => {
  const [properties, setProperties] = useState<PropertyListItem[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Load properties (simulation)
  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from an API
      setProperties(initialProperties);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load properties'));
    } finally {
      setLoading(false);
    }
  }, [initialProperties]);
  
  // Add a new property
  const addProperty = useCallback((property: Omit<PropertyListItem, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newProperty: PropertyListItem = {
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      ...property
    };
    
    setProperties(prev => [...prev, newProperty]);
    return newProperty;
  }, []);
  
  // Update a property
  const updateProperty = useCallback((id: string, updates: Partial<PropertyListItem>) => {
    setProperties(prev => prev.map(property => {
      if (property.id === id) {
        return {
          ...property,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      return property;
    }));
  }, []);
  
  // Delete a property
  const deleteProperty = useCallback((id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
  }, []);
  
  // Load properties on initial mount
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);
  
  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: loadProperties
  };
};
