
import { useCallback } from 'react';
import { FloorPlan } from '@/types/core';
import { captureError } from '@/utils/sentryUtils';

interface ErrorHandlingProps {
  currentFloorPlan: FloorPlan | null;
  onError: (error: Error) => void;
}

export const useCanvasControllerErrorHandling = ({
  currentFloorPlan,
  onError
}: ErrorHandlingProps) => {
  const handleError = useCallback((error: Error) => {
    console.error('Canvas Controller Error:', error);
    onError(error);

    captureError(error, {
      context: 'canvas-controller',
      floorPlanId: currentFloorPlan?.id
    });
  }, [currentFloorPlan, onError]);

  return {
    handleError
  };
};

export default useCanvasControllerErrorHandling;
