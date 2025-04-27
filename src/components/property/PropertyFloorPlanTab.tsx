
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AiOutlineEdit } from 'react-icons/ai';
import { PropertyStatus } from '@/types/roles';

interface PropertyFloorPlanTabProps {
  canEdit?: boolean;
  isApprovedUser?: boolean;
  propertyStatus?: PropertyStatus;
  onMeasurementGuideOpen?: () => void;
}

export const PropertyFloorPlanTab: React.FC<PropertyFloorPlanTabProps> = ({
  canEdit = false,
  isApprovedUser = false,
  propertyStatus,
  onMeasurementGuideOpen
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plan Editor</CardTitle>
        <CardDescription>
          Create and edit the floor plan for this property
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Click the button below to start editing the floor plan
          </p>
          <Button 
            disabled={!canEdit || propertyStatus === PropertyStatus.COMPLETED} 
            onClick={() => { console.log("Open floor plan editor"); }}
          >
            <AiOutlineEdit className="mr-2 h-4 w-4" />
            Edit Floor Plan
          </Button>
          {onMeasurementGuideOpen && (
            <Button 
              variant="outline"
              onClick={onMeasurementGuideOpen}
              className="ml-2"
            >
              Measurement Guide
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {!canEdit && "You don't have permission to edit the floor plan"}
          {canEdit && propertyStatus === PropertyStatus.COMPLETED && "This property is marked as completed and cannot be edited"}
        </p>
      </CardFooter>
    </Card>
  );
};
