
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyStatus } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PropertyDetailContent } from '@/components/property/PropertyDetailContent';
import { usePropertyUpdate } from '@/hooks/property/usePropertyUpdate';

/**
 * Property Detail Page
 * Shows detailed information about a property
 */
export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use property update hook
  const { updatePropertyStatus } = usePropertyUpdate();
  
  // Redirect if no ID
  useEffect(() => {
    if (!id) {
      toast.error('Property ID is required');
      navigate('/properties');
    }
  }, [id, navigate]);
  
  /**
   * Handle property status change
   * @param newStatus New property status
   */
  const handleStatusChange = async (newStatus: PropertyStatus): Promise<void> => {
    if (!id) {
      toast.error('Property ID is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the correct parameter
      await updatePropertyStatus(newStatus);
      toast.success('Property status updated successfully');
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div data-testid="property-detail-page">
      {id && (
        <PropertyDetailContent
          id={id}
          user={user}
          userRole={userRole}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
