
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus, canEditProperty } from '@/types/propertyTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Canvas } from '@/components/Canvas';
import { ArrowLeft, Grid } from 'lucide-react';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { toast } from 'sonner';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { PropertyDetailsTab } from '@/components/property/PropertyDetailsTab';
import { PropertyFloorPlanTab } from '@/components/property/PropertyFloorPlanTab';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProperty, getProperty, updatePropertyStatus, isLoading } = usePropertyManagement();
  const { user, userRole } = useAuth();
  const { floorPlans, setFloorPlans, loadData } = useSyncedFloorPlans();
  const [activeTab, setActiveTab] = useState('details');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          console.log("Fetching property with ID:", id);
          const property = await getProperty(id);
          if (!property) {
            setHasError(true);
            setErrorMessage('Property not found');
            toast.error('Property not found');
          }
        } catch (error) {
          console.error('Error fetching property:', error);
          setHasError(true);
          setErrorMessage('Failed to load property details');
          toast.error('Failed to load property details');
        }
      }
    };
    
    fetchProperty();
  }, [id, getProperty]);

  useEffect(() => {
    if (currentProperty?.floor_plans && currentProperty.floor_plans.length > 0) {
      setFloorPlans(currentProperty.floor_plans);
    } else {
      loadData();
    }
  }, [currentProperty, setFloorPlans, loadData]);

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    if (id) {
      getProperty(id);
    }
  };

  const navigateToProperties = () => {
    navigate('/properties');
  };

  const navigateToFloorplans = () => {
    navigate('/floorplans');
  };

  const handleStatusChange = async (newStatus: PropertyStatus) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await updatePropertyStatus(id, newStatus);
      toast.success(`Property status updated to ${newStatus}`);
      await getProperty(id);
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPropertyContent = () => {
    if (!currentProperty || !user) {
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

    const canEdit = canEditProperty(currentProperty, userRole, user.id);
    
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
          <PropertyHeader property={currentProperty} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <PropertyDetailsTab 
              property={currentProperty}
              userRole={userRole}
              propertyId={id}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="floorplan" className="space-y-4">
            <PropertyFloorPlanTab 
              canEdit={canEdit}
              userRole={userRole}
              property={currentProperty}
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
      hasError={hasError}
      errorMessage={errorMessage}
      onRetry={handleRetry}
    >
      {renderPropertyContent()}
    </LoadingErrorWrapper>
  );
};

export default PropertyDetail;
