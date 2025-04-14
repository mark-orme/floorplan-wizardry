
/**
 * Hook for enhanced grid snapping with multi-device support
 * @module hooks/straightLineTool/useEnhancedGridSnapping
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { DrawingMode } from '@/constants/drawingModes';

export type InputMethod = 'mouse' | 'touch' | 'stylus' | 'keyboard';

export interface UseEnhancedGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  snapThreshold?: number;
}

/**
 * Enhanced grid snapping with support for mouse, touch, and stylus input
 */
export const useEnhancedGridSnapping = ({
  fabricCanvasRef,
  snapThreshold = 10
}: UseEnhancedGridSnappingProps) => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  const lastEventRef = useRef<any>(null);
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();
  
  // Get grid size from constants
  const gridSize = GRID_CONSTANTS.GRID_SIZE || 20;
  
  // Detect input method from event
  const detectInputMethod = useCallback((e: any): InputMethod => {
    try {
      if (!e) return 'mouse';
      
      // Check if it's a touch event
      if (e.type && e.type.startsWith('touch')) {
        // Check for Apple Pencil or stylus
        if (e.touches && e.touches[0]) {
          const touch = e.touches[0];
          const isStylus = 
            (touch.touchType === 'stylus') || 
            (typeof touch.force !== 'undefined' && touch.force > 0) ||
            (touch.radiusX !== undefined && touch.radiusX < 10);
          
          return isStylus ? 'stylus' : 'touch';
        }
        return 'touch';
      }
      
      // Check if it's a keyboard event
      if (e.type && e.type.startsWith('key')) {
        return 'keyboard';
      }
      
      // Default to mouse for all other events
      return 'mouse';
    } catch (error) {
      reportDrawingError(error, 'detect-input-method', {
        tool: DrawingMode.STRAIGHT_LINE
      });
      return 'mouse'; // Default fallback
    }
  }, [reportDrawingError]);
  
  /**
   * Snap a single point to the nearest grid intersection
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    try {
      const x = Math.round(point.x / gridSize) * gridSize;
      const y = Math.round(point.y / gridSize) * gridSize;
      
      return { x, y };
    } catch (error) {
      reportDrawingError(error, 'snap-point-to-grid', {
        tool: DrawingMode.STRAIGHT_LINE
      });
      return point; // Return original point on error
    }
  }, [snapEnabled, gridSize, reportDrawingError]);
  
  /**
   * Snap a line to the grid with additional constraints
   * - Preserves horizontal, vertical, and 45-degree angles
   * - Provides enhanced precision for stylus input
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!snapEnabled) return { start, end };
    
    try {
      // Default to snapped grid points
      let snappedStart = snapPointToGrid(start);
      let snappedEnd = snapPointToGrid(end);
      
      // Check for shift key (or equivalent constraint trigger)
      const isConstrained = 
        // From keyboard event
        (lastEventRef.current && (lastEventRef.current.shiftKey || 
        // From custom property in our events
        lastEventRef.current.constrained));
      
      if (isConstrained) {
        // Calculate the angle for constraint
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Snap to nearest 45-degree increment
        const snappedAngle = Math.round(angle / 45) * 45;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert back to endpoint
        const radian = snappedAngle * Math.PI / 180;
        snappedEnd = {
          x: start.x + distance * Math.cos(radian),
          y: start.y + distance * Math.sin(radian)
        };
        
        // Final grid snap of the end point
        snappedEnd = snapPointToGrid(snappedEnd);
      }
      
      return { start: snappedStart, end: snappedEnd };
    } catch (error) {
      reportDrawingError(error, 'snap-line-to-grid', {
        tool: DrawingMode.STRAIGHT_LINE
      });
      return { start, end }; // Return original points on error
    }
  }, [snapEnabled, snapPointToGrid, reportDrawingError]);
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
    
    logDrawingEvent(`Grid snapping ${snapEnabled ? 'disabled' : 'enabled'}`, 'toggle-grid-snap', {
      tool: DrawingMode.STRAIGHT_LINE
    });
  }, [snapEnabled, logDrawingEvent]);
  
  /**
   * Set up event listeners to track input method
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const element = canvas.getElement();
    
    const handleEvent = (e: any) => {
      const detectedMethod = detectInputMethod(e);
      lastEventRef.current = e;
      
      if (detectedMethod !== inputMethod) {
        setInputMethod(detectedMethod);
      }
    };
    
    // Add event listeners for various input methods
    element.addEventListener('mousedown', handleEvent, { passive: true });
    element.addEventListener('touchstart', handleEvent, { passive: true });
    canvas.on('mouse:down', handleEvent);
    
    return () => {
      element.removeEventListener('mousedown', handleEvent);
      element.removeEventListener('touchstart', handleEvent);
      canvas.off('mouse:down', handleEvent);
    };
  }, [fabricCanvasRef, detectInputMethod, inputMethod]);
  
  return {
    snapEnabled,
    inputMethod,
    snapPointToGrid,
    snapLineToGrid,
    toggleSnapToGrid,
    detectInputMethod
  };
};
