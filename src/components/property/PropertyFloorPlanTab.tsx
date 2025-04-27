
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AiOutlineCalculator } from 'react-icons/ai';
import { toast } from 'sonner';
import { PropertyStatus } from '@/types/propertyTypes';

interface PropertyFloorPlanTabProps {
  isApprovedUser?: boolean;
  propertyStatus?: PropertyStatus;
  onMeasurementGuideOpen?: () => void;
}

export const PropertyFloorPlanTab = ({
  isApprovedUser = false,
  propertyStatus = PropertyStatus.PENDING,
  onMeasurementGuideOpen
}: PropertyFloorPlanTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floorPlanData, setFloorPlanData] = useState(null);

  const openMeasurementGuide = () => {
    if (onMeasurementGuideOpen) {
      onMeasurementGuideOpen();
    } else {
      toast.info('Measurement guide feature coming soon');
    }
  };

  const handleMeasurementsSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Measurements saved successfully');
    } catch (error) {
      toast.error('Failed to save measurements');
      console.error('Error submitting measurements:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plan Measurements</CardTitle>
        <CardDescription>
          Create and manage property floor plans and measurements
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!floorPlanData ? (
          <p className="text-muted-foreground">No floor plans have been created yet. Start by adding a new floor plan.</p>
        ) : (
          <p>Floor plan content will be displayed here.</p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={openMeasurementGuide}
          disabled={isSubmitting}
        >
          <AiOutlineCalculator className="h-4 w-4 mr-2" />
          Measurement Guide
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyFloorPlanTab;
