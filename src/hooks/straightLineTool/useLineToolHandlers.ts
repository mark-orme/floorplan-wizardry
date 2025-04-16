
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineToolHandlersProps {
  lineState: any; // Using any for simplicity, should match the return value of useLineState
  updateMeasurementData: (data: { distance: number; angle: number; snapped: boolean; unit: string }) => void;
}

export const useLineToolHandlers = ({
  lineState,
  updateMeasurementData
}: UseLineToolHandlersProps) => {
  // Handle mouse down event
  const handleMouseDown = useCallback((e: any) => {
    if (!e.target) {
      // Get pointer position
      const pointer = e.absolutePointer || e.pointer;
      const point = { x: pointer.x, y: pointer.y };
      
      // Start drawing
      lineState.startDrawing(point);
      
      // Initial measurement (zero distance)
      updateMeasurementData({
        distance: 0,
        angle: 0,
        snapped: false,
        unit: 'px'
      });
    }
  }, [lineState, updateMeasurementData]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: any) => {
    if (lineState.isDrawing && lineState.startPoint) {
      // Get pointer position
      const pointer = e.absolutePointer || e.pointer;
      const point = { x: pointer.x, y: pointer.y };
      
      // Continue drawing
      lineState.continueDrawing(point);
      
      // Calculate and update measurements
      if (lineState.startPoint && lineState.currentPoint) {
        const dx = lineState.currentPoint.x - lineState.startPoint.x;
        const dy = lineState.currentPoint.y - lineState.startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
        
        updateMeasurementData({
          distance,
          angle,
          snapped: lineState.snapEnabled,
          unit: 'px'
        });
      }
    }
  }, [lineState, updateMeasurementData]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((e: any) => {
    if (lineState.isDrawing) {
      // Get pointer position
      const pointer = e.absolutePointer || e.pointer;
      const point = { x: pointer.x, y: pointer.y };
      
      // Complete drawing
      lineState.completeDrawing(point);
      
      // Reset measurement
      updateMeasurementData({
        distance: 0,
        angle: 0,
        snapped: false,
        unit: 'px'
      });
    }
  }, [lineState, updateMeasurementData]);
  
  // Handle key down event (e.g., Escape to cancel drawing)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && lineState.isDrawing) {
      // Cancel drawing
      lineState.cancelDrawing();
      
      // Reset measurement
      updateMeasurementData({
        distance: 0,
        angle: 0,
        snapped: false,
        unit: 'px'
      });
    }
  }, [lineState, updateMeasurementData]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  };
};
