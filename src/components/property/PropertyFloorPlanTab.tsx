
/**
 * Property Floor Plan Tab Component
 * Provides an interactive floor plan editor with appropriate controls based on user role
 * @module components/property/PropertyFloorPlanTab
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { useCanvasErrorHandling } from '@/hooks/useCanvasErrorHandling';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { FloorPlanActions } from './FloorPlanActions';

/**
 * PropertyFloorPlanTab component props
 * @interface PropertyFloorPlanTabProps
 */
interface PropertyFloorPlanTabProps {
  /** Whether the current user can edit the property */
  canEdit: boolean;
  /** The role of the current user */
  userRole: UserRole;
  /** Property data */
  property: {
    /** Current status of the property */
    status: PropertyStatus;
  };
  /** Whether a status change submission is in progress */
  isSubmitting: boolean;
  /** Handler for property status changes */
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

/**
 * PropertyFloorPlanTab Component
 * Displays and enables interaction with a property floor plan
 * 
 * @param {PropertyFloorPlanTabProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const PropertyFloorPlanTab = ({
  canEdit,
  userRole,
  property,
  isSubmitting,
  onStatusChange
}: PropertyFloorPlanTabProps) => {
  const [initError, setInitError] = useState(false);
  
  // Set up error handling
  const { handleRetry } = useCanvasErrorHandling({
    setHasError: setInitError,
    setErrorMessage: () => {},
    resetLoadTimes: () => {},
    loadData: async () => {}
  });
  
  /**
   * Handle canvas error
   * Sets error state and logs the issue
   */
  const handleCanvasError = () => {
    setInitError(true);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>Floor Plan</CardTitle>
        <CardDescription>
          {canEdit 
            ? 'Edit the floor plan for this property' 
            : 'View the floor plan for this property'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
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
  );
};
