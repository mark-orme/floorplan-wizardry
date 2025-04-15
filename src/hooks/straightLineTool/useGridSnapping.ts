
/**
 * Hook for grid snapping functionality
 * @module hooks/straightLineTool/useGridSnapping
 */
import { useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import { snapPointToGrid as gridSnapPointToGrid, snapLineToGrid as utilsSnapLineToGrid } from '@/utils/grid/snapping';
import * as Sentry from '@sentry/react';

interface UseGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialSnapEnabled?: boolean;
}

/**
 * Hook providing grid snapping functionality for drawing tools
 * Allows toggling snapping on/off and snapping points/lines to the grid
 * 
 * @param props Configuration options
 * @returns Grid snapping functions and state
 */
export const useGridSnapping = ({
  fabricCanvasRef,
  initialSnapEnabled = true
}: UseGridSnappingProps) => {
  // State for grid snapping
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Set Sentry context for grid snapping
  useEffect(() => {
    Sentry.setTag("component", "useGridSnapping");
    Sentry.setTag("snapEnabled", snapEnabled.toString());
    
    Sentry.setContext("gridSnappingState", {
      enabled: snapEnabled,
      canvasAvailable: !!fabricCanvasRef.current
    });
    
    return () => {
      Sentry.setTag("component", null);
    };
  }, [snapEnabled, fabricCanvasRef]);
  
  // Function to toggle grid snapping
  const toggleGridSnapping = useCallback((): boolean => {
    setSnapEnabled(prev => !prev);
    const newState = !snapEnabled;
    
    // Update Sentry context
    Sentry.setTag("action", "toggleGridSnapping");
    Sentry.setContext("gridSnappingToggle", {
      previousState: snapEnabled,
      newState,
      timestamp: new Date().toISOString()
    });
    
    // Provide feedback
    toast.info(newState ? "Grid snapping enabled" : "Grid snapping disabled", {
      id: 'grid-snap-toggle'
    });
    
    return newState;
  }, [snapEnabled]);
  
  // Function to snap a point to the grid
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    return gridSnapPointToGrid(point);
  }, [snapEnabled]);
  
  // Function to snap a line to the grid - fixed argument handling
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    // Properly call the utility function with both points
    return utilsSnapLineToGrid(start, end);
  }, [snapEnabled]);
  
  return {
    snapEnabled,
    toggleGridSnapping,
    snapPointToGrid,
    snapLineToGrid
  };
};
