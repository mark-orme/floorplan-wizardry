
/**
 * Hook for grid snapping functionality
 * @module hooks/straightLineTool/useGridSnapping
 */
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import { snapPointToGrid as gridSnapPointToGrid } from '@/utils';

interface UseGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialSnapEnabled?: boolean;
}

export const useGridSnapping = ({
  fabricCanvasRef,
  initialSnapEnabled = true
}: UseGridSnappingProps) => {
  // State for grid snapping
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Function to toggle grid snapping
  const toggleGridSnapping = useCallback((): boolean => {
    setSnapEnabled(prev => !prev);
    const newState = !snapEnabled;
    
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
  
  // Function to snap a line to the grid
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    toggleGridSnapping,
    snapPointToGrid,
    snapLineToGrid
  };
};
