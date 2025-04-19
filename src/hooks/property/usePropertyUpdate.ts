
/**
 * Custom hook for updating property data
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';
import { PropertyStatus } from '@/lib/supabase';
import { verifyResourceOwnership } from '@/utils/security/resourceOwnership';

interface UsePropertyUpdateProps {
  propertyId: string;
  onSuccess?: () => void;
}

export function usePropertyUpdate({ propertyId, onSuccess }: UsePropertyUpdateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updatePropertyStatus = async (newStatus: PropertyStatus) => {
    if (!user) {
      toast.error('You must be logged in to update a property');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First check if user has permission to update this property
      const isAuthorized = await verifyResourceOwnership(user.id, 'properties', propertyId);
      
      if (!isAuthorized) {
        throw new Error('You do not have permission to update this property');
      }

      // Now update the property status
      const updateResult = await supabase
        .from('properties')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (updateResult.error) {
        throw new Error(updateResult.error.message);
      }

      logger.info(`Updated property ${propertyId} status to ${newStatus}`);
      toast.success(`Property status updated to ${newStatus}`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      logger.error(`Error updating property status: ${errorMessage}`);
      toast.error(`Failed to update property: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updatePropertyStatus,
    isSubmitting,
    error
  };
}
