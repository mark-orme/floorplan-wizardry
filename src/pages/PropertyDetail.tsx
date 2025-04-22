
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyDetailContent } from '@/components/property/PropertyDetailContent';
import { PropertyStatus } from '@/types/propertyTypes';
import { toast } from 'sonner';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, userRole } = useAuth();

  const handleStatusChange = async (propertyId: string, status: PropertyStatus) => {
    try {
      console.log(`Updating property ${propertyId} status to ${status}`);
      // In a real implementation, this would call a Supabase function
      toast.success(`Property status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
      return false;
    }
  };

  if (!id) {
    return <div>Property ID is required</div>;
  }

  return (
    <PropertyDetailContent
      id={id}
      user={user}
      userRole={userRole}
      onStatusChange={handleStatusChange}
    />
  );
}
