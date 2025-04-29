
import { useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';
import { useLineDrawing } from './useLineDrawing';
import { toolsLogger } from '@/utils/logger';
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
  const { anglesEnabled, setAnglesEnabled, snapToAngle, toggleAngles } = useLineAngleSnap({ 
    enabled: true
  });

  // Use line drawing hooks for canvas operations
  const { createLine, updateLine, finalizeLine, removeLine } = useLineDrawing(
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  );
  
  // Create adapter functions to match expected signatures
  const createLineAdapter = (x1: number, y1: number, x2: number, y2: number) => {
    return createLine(x1, y1, x2, y2);
  };

  const updateLineAdapter = (line: Line, x2: number, y2: number) => {
    return updateLine(line, x2, y2);
  };
  
  // Get actions from the extracted hook
  const actions = useLineStateActions({
    coreState,
    snapEnabled,
    snapToGrid,
    anglesEnabled,
    snapToAngle,
    createLine: createLineAdapter,
    updateLine: updateLineAdapter,
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
    toggleAngles
  };
};
