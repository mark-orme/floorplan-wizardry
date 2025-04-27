import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AiOutlineRuler } from 'react-icons/ai';
import { toast } from 'sonner';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { useCanvasErrorHandling } from '@/hooks/useCanvasErrorHandling';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { FloorPlanActions } from './FloorPlanActions';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';

/**
 * Floor Plan Tab component for property details
 * Displays floor plan editor and related controls
 */
interface PropertyFloorPlanTabProps {
  canEdit: boolean;
  userRole: UserRole;
  property: { status: PropertyStatus };
  isSubmitting: boolean;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

export const PropertyFloorPlanTab = ({
  canEdit,
  userRole,
  property,
  isSubmitting,
  onStatusChange
}: PropertyFloorPlanTabProps) => {
  const [hasError, setHasError] = useState(false);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Handle canvas errors
  const handleCanvasError = () => {
    setHasError(true);
    toast.error("There was an error loading the floor plan editor");
  };
  
  // Open measurement guide modal
  const openMeasurementGuide = () => {
    setShowMeasurementGuide(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Floor Plan</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openMeasurementGuide}
          disabled={isSubmitting}
        >
          <AiOutlineRuler className="h-4 w-4 mr-2" />
          Measurement Guide
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan Editor</CardTitle>
          <CardDescription>
            Draw the property floor plan using the tools below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FloorPlanCanvas onCanvasError={handleCanvasError} />
        </CardContent>
        <CardFooter>
          <FloorPlanActions
            canEdit={canEdit}
            userRole={userRole}
            isSubmitting={isSubmitting}
            onStatusChange={onStatusChange}
          />
        </CardFooter>
      </Card>
      
      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={() => setShowMeasurementGuide(false)}
        onOpenChange={setShowMeasurementGuide}
      />
    </div>
  );
};
