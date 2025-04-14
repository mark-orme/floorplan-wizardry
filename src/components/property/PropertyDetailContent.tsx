
import { useProperty } from '@/hooks/query/usePropertyQuery';
import { Property, PropertyStatus } from '@/types/propertyTypes';
import { PropertyDetailsTab } from './PropertyDetailsTab';
import { PropertyFloorPlanTab } from './PropertyFloorPlanTab';
import { PropertyHeader } from './PropertyHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/lib/supabase';
import { canEditProperty } from '@/types/propertyTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';

interface PropertyDetailContentProps {
  id: string;
  user: any;
  userRole: UserRole | null;
  onStatusChange: (id: string, status: PropertyStatus) => Promise<void>;
}

export function PropertyDetailContent({
  id,
  user,
  userRole,
  onStatusChange
}: PropertyDetailContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    data: property,
    isLoading,
    isError,
    error,
    refetch
  } = useProperty(id, {
    enabled: !!id && !!user
  });

  const handleRetry = () => {
    refetch();
  };

  const navigateToProperties = () => {
    navigate('/properties');
  };

  const navigateToFloorplans = () => {
    navigate('/floorplans');
  };

  const handleStatusChange = async (newStatus: PropertyStatus) => {
    setIsSubmitting(true);
    try {
      await onStatusChange(id, newStatus);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPropertyContent = () => {
    if (!property || !user) {
      return (
        <div className="container mx-auto py-12 text-center">
          <p>Property not found or you don't have access to view it</p>
          <div className="flex justify-center gap-3 mt-4">
            <Button onClick={navigateToProperties}>
              <Home className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
            <Button variant="outline" onClick={navigateToFloorplans}>
              <Grid className="mr-2 h-4 w-4" />
              Go to Floor Plan Editor
            </Button>
          </div>
        </div>
      );
    }

    const canEdit = userRole ? canEditProperty(property, userRole, user.id) : false;
    
    // Property header expects these specific props
    const headerProps = {
      order_id: property.order_id || property.id,
      status: property.status,
      address: property.address
    };
    
    // Property details tab expects these specific props
    const detailsProps = {
      order_id: property.order_id || property.id,
      client_name: property.client_name || 'Unknown',
      address: property.address,
      branch_name: property.branch_name || undefined,
      created_at: property.created_at || property.createdAt,
      updated_at: property.updated_at || property.updatedAt,
      notes: property.notes,
      status: property.status
    };
    
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={navigateToProperties}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToFloorplans}>
            <Grid className="mr-2 h-4 w-4" />
            Floor Plan Editor
          </Button>
          <PropertyHeader property={headerProps} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <PropertyDetailsTab 
              property={detailsProps}
              userRole={userRole || UserRole.PHOTOGRAPHER}
              propertyId={id}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="floorplan" className="space-y-4">
            <PropertyFloorPlanTab 
              canEdit={canEdit}
              userRole={userRole || UserRole.PHOTOGRAPHER}
              property={property}
              isSubmitting={isSubmitting}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      hasError={isError}
      errorMessage={error?.message || 'Failed to load property'}
      onRetry={handleRetry}
    >
      {renderPropertyContent()}
    </LoadingErrorWrapper>
  );
}
