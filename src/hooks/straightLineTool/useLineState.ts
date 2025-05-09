
import { useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';
import { useLineDrawing } from './useLineDrawing';
import { useLineStateCore } from './useLineStateCore';
import { useLineStateActions } from './useLineStateActions';

interface UseLineStateOptions {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing line tool state
 */
export const useLineState = ({ 
  fabricCanvasRef, 
  lineColor, 
  lineThickness,
  saveCurrentState 
}: UseLineStateOptions) => {
  // Get core state from the extracted hook
  const coreState = useLineStateCore();
  
  // Grid and angle snapping
  const { snapEnabled, toggleGridSnapping, snapToGrid } = useEnhancedGridSnapping({
    initialSnapEnabled: true
  });
  
  // Use the updated hooks that include the compatibility methods
  const angleSnapHook = useLineAngleSnap({ enabled: true });
  const { 
    isEnabled: anglesEnabled, 
    snapAngle, 
    toggleEnabled: toggleAngles 
  } = angleSnapHook;
  
  // Modified snapToAngle wrapper that returns a Point
  const adaptedSnapToAngle = (start: Point, end: Point): Point => {
    const result = snapAngle(start, end);
    return result.point;
  };

  // Use line drawing hooks for canvas operations
  const { createLine, updateLine, finalizeLine, removeLine } = useLineDrawing({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Get actions from the extracted hook
  const actions = useLineStateActions({
    coreState,
    snapEnabled,
    snapToGrid,
    anglesEnabled,
    snapToAngle: adaptedSnapToAngle,
    createLine,
    updateLine,
    finalizeLine,
    removeLine
  });
  
  return {
    // State from core
    ...coreState,
    
    // Snapping state
    snapEnabled,
    anglesEnabled,
    
    // Actions
    ...actions,
    
    // Toggles
    toggleSnap: toggleGridSnapping,
    toggleAngles,
    
    // For backwards compatibility
    toggleGridSnapping,
    measurementData: { 
      startPoint: coreState.startPoint, 
      endPoint: coreState.currentPoint, 
      distance: coreState.startPoint && coreState.currentPoint ? 
        Math.sqrt(
          Math.pow(coreState.currentPoint.x - coreState.startPoint.x, 2) + 
          Math.pow(coreState.currentPoint.y - coreState.startPoint.y, 2)
        ) : 0, 
      angle: 0, 
      midPoint: coreState.startPoint && coreState.currentPoint ? {
        x: (coreState.startPoint.x + coreState.currentPoint.x) / 2,
        y: (coreState.startPoint.y + coreState.currentPoint.y) / 2
      } : { x: 0, y: 0 }, 
      unit: 'px', 
      pixelsPerMeter: 100 
    }
  };
};

export default useLineState;
