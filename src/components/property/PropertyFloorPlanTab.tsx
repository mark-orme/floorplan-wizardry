
import React from 'react';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { Button } from '@/components/ui/button';
import { PropertyStatus } from '@/types/floorPlanTypes';

interface PropertyFloorPlanTabProps {
  floorPlans: Array<{
    id: string;
    name: string;
    width?: number;
    height?: number;
  }>;
  propertyStatus: PropertyStatus;
}

export const PropertyFloorPlanTab: React.FC<PropertyFloorPlanTabProps> = ({
  floorPlans,
  propertyStatus
}) => {
  const [selectedPlan, setSelectedPlan] = React.useState(floorPlans[0]?.id);

  const handleCanvasError = (error: Error) => {
    console.error('Floor plan canvas error:', error);
  };

  const isUnavailable = propertyStatus === 'sold' || propertyStatus === 'pending';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {floorPlans.map((plan) => (
          <Button
            key={plan.id}
            variant={selectedPlan === plan.id ? 'default' : 'outline'}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.name}
          </Button>
        ))}
      </div>
      
      {selectedPlan ? (
        <div className="relative">
          <FloorPlanCanvas onCanvasError={handleCanvasError} />
          
          {isUnavailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded shadow-lg text-center">
                <p className="text-lg font-bold">
                  {propertyStatus === 'sold' ? 'Property Sold' : 'Sale Pending'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Floor plans are not available for viewing
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-md">
          <p className="text-gray-500">No floor plans available</p>
        </div>
      )}
    </div>
  );
};
