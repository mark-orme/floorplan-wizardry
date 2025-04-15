
/**
 * Optimized grid snapping hook with reduced jitter
 */
import { useCallback, useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Point } from '@/types/core/Point';
import { requestOptimizedRender, createSmoothEventHandler } from '@/utils/canvas/renderOptimizer';

interface UseOptimizedGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialSnapEnabled?: boolean;
  gridSize?: number;
}

export const useOptimizedGridSnapping = ({
  fabricCanvasRef,
  initialSnapEnabled = true,
  gridSize = GRID_CONSTANTS.GRID_SIZE
}: UseOptimizedGridSnappingProps) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const lastValidPointRef = useRef<Point | null>(null);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Optimized point snapping with jitter reduction
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) {
      lastValidPointRef.current = point;
      return { ...point };
    }
    
    try {
      // Round to nearest grid point
      const snappedPoint = {
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize
      };
      
      // Store as last valid point
      lastValidPointRef.current = snappedPoint;
      return snappedPoint;
    } catch (error) {
      console.error('Error snapping point to grid:', error);
      // Return original point or last valid point as fallback
      return lastValidPointRef.current || point;
    }
  }, [snapEnabled, gridSize]);
  
  /**
   * Snap a line to grid with reduced jitter
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) {
      return { start: { ...start }, end: { ...end } };
    }
    
    try {
      // Snap both points
      const snappedStart = snapPointToGrid(start);
      const snappedEnd = snapPointToGrid(end);
      
      // Calculate delta to see if we should make horizontal or vertical
      const dx = Math.abs(snappedEnd.x - snappedStart.x);
      const dy = Math.abs(snappedEnd.y - snappedStart.y);
      
      // Threshold for auto-straightening (as a factor of grid size)
      const straightenThreshold = gridSize * 0.5;
      
      // Make line exactly horizontal or vertical if it's close
      if (dx < straightenThreshold) {
        snappedEnd.x = snappedStart.x;
      } else if (dy < straightenThreshold) {
        snappedEnd.y = snappedStart.y;
      }
      
      return { start: snappedStart, end: snappedEnd };
    } catch (error) {
      console.error('Error snapping line to grid:', error);
      return { start, end };
    }
  }, [snapEnabled, snapPointToGrid, gridSize]);
  
  // Setup canvas event listeners for object movement
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !snapEnabled) return;
    
    // Create optimized object moving handler
    const handleObjectMoving = createSmoothEventHandler((e: any) => {
      if (!snapEnabled) return;
      
      const obj = e.target;
      if (!obj) return;
      
      // Get current position
      const p = { x: obj.left, y: obj.top };
      
      // Snap to grid
      const snapped = snapPointToGrid(p);
      
      // Apply snapped position
      obj.set({
        left: snapped.x,
        top: snapped.y
      });
      
      // Request optimized render
      requestOptimizedRender(canvas, 'objectMoving');
    }, 16); // ~60fps
    
    // Add event listener
    canvas.on('object:moving', handleObjectMoving);
    
    // Clean up
    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [fabricCanvasRef, snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    toggleSnapToGrid,
    snapPointToGrid,
    snapLineToGrid
  };
};
