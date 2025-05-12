
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/FloorPlan'; // Ensure correct casing

interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  postcode: string;
  description?: string;
  floorPlans: FloorPlan[];
}

export const usePropertyCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const createProperty = useCallback(async (data: PropertyFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast.success('Property created successfully');
      return { id: 'property-' + Date.now(), ...data };
    } catch (err) {
      const createError = err instanceof Error ? err : new Error('Failed to create property');
      setError(createError);
      toast.error(`Error: ${createError.message}`);
      throw createError;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    createProperty,
    loading,
    error
  };
};
