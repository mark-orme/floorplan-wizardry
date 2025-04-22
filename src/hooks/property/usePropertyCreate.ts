
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PropertyFormValues } from '@/components/property/PropertyFormFields';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UsePropertyCreateProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const usePropertyCreate = ({ onSuccess, onError }: UsePropertyCreateProps = {}) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const createProperty = async (propertyData: PropertyFormValues) => {
    setIsCreating(true);

    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      setIsCreating(false);
      toast.error(`Failed to create property: ${error.message}`);
      onError?.(error);
      throw error;
    }

    setIsCreating(false);
    toast.success('Property created successfully!');
    onSuccess?.();
    router.push('/properties');

    return data;
  };

  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      // Success logic already handled in createProperty
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      // Error logic already handled in createProperty
    }
  });

  return {
    createProperty: mutation.mutate,
    isCreating,
    ...mutation,
  };
};
