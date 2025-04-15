
/**
 * Hook for enhanced grid snapping functionality
 * @module hooks/straightLineTool/useEnhancedGridSnapping
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface UseEnhancedGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridSize?: number;
}

/**
 * Hook for providing enhanced grid snapping functionality
 */
export const useEnhancedGridSnapping = ({
  fabricCanvasRef,
  gridSize = GRID_CONSTANTS.GRID_SIZE || 20
}: UseEnhancedGridSnappingProps = {
  fabricCanvasRef: { current: null },
  gridSize: 20
}) => {
  // State for grid snapping
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [inputMethod, setInputMethod] = useState<string>('mouse');
  
  // Track the input method based on events
  useEffect(() => {
    const detectInputMethod = (e: TouchEvent | MouseEvent | PointerEvent) => {
      if (e instanceof TouchEvent) {
        setInputMethod('touch');
      } else if (e instanceof PointerEvent) {
        if (e.pointerType === 'pen' || e.pointerType === 'stylus') {
          setInputMethod('stylus');
        } else if (e.pointerType === 'touch') {
          setInputMethod('touch');
        } else {
          setInputMethod('mouse');
        }
      } else {
        setInputMethod('mouse');
      }
    };
    
    window.addEventListener('mousemove', detectInputMethod);
    window.addEventListener('touchstart', detectInputMethod);
    window.addEventListener('pointerdown', detectInputMethod);
    
    return () => {
      window.removeEventListener('mousemove', detectInputMethod);
      window.removeEventListener('touchstart', detectInputMethod);
      window.removeEventListener('pointerdown', detectInputMethod);
    };
  }, []);
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection
   * @param point The point to snap
   * @returns The snapped point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: snappedX, y: snappedY };
  }, [snapEnabled, gridSize]);
  
  /**
   * Snap a line to the grid
   * @param line The fabric.js Line object to snap
   */
  const snapLineToGrid = useCallback((line: Line) => {
    if (!snapEnabled || !line) return;
    
    try {
      // Get current coordinates
      const x1 = line.x1 || 0;
      const y1 = line.y1 || 0;
      const x2 = line.x2 || 0;
      const y2 = line.y2 || 0;
      
      // Snap endpoints
      const snappedStart = snapPointToGrid({ x: x1, y: y1 });
      const snappedEnd = snapPointToGrid({ x: x2, y: y2 });
      
      // Apply snapped coordinates
      line.set({
        x1: snappedStart.x,
        y1: snappedStart.y,
        x2: snappedEnd.x,
        y2: snappedEnd.y
      });
    } catch (error) {
      console.error('Error snapping line to grid:', error);
    }
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    inputMethod,
    toggleSnapToGrid,
    snapPointToGrid,
    snapLineToGrid
  };
};
