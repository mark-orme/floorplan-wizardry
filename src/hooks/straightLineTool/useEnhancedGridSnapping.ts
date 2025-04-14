
/**
 * Hook for enhanced grid snapping with touch and pencil support
 * @module hooks/straightLineTool/useEnhancedGridSnapping
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Point as FabricPoint } from 'fabric';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';

interface UseEnhancedGridSnappingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridSize?: number;
  snapThreshold?: number; // Distance in pixels to trigger snapping
  sensitivityForTouch?: number; // Increased snapping area for touch
}

/**
 * Hook providing enhanced grid snapping functionality optimized for touch and stylus
 */
export const useEnhancedGridSnapping = ({
  fabricCanvasRef,
  gridSize = GRID_CONSTANTS.GRID_SIZE || 20,
  snapThreshold = 10,
  sensitivityForTouch = 2 // Multiplier for touch events
}: UseEnhancedGridSnappingProps) => {
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();
  
  // Get base grid snapping
  const { 
    snapPointToGrid: baseSnapToGrid, 
    snapLineToGrid: baseSnapLineToGrid,
    snapEnabled,
    toggleSnapToGrid
  } = useSnapToGrid({ 
    fabricCanvasRef,
    defaultGridSize: gridSize
  });
  
  // Track the input method
  const [inputMethod, setInputMethod] = useState<'mouse' | 'touch' | 'stylus'>('mouse');
  
  // Track latest pointer position for debugging
  const lastPointerRef = useRef<Point | null>(null);
  
  // Adjust snap threshold based on input method
  const getAdjustedThreshold = useCallback((): number => {
    if (inputMethod === 'stylus') {
      return snapThreshold * 0.8; // More precise for stylus
    } else if (inputMethod === 'touch') {
      return snapThreshold * sensitivityForTouch; // Increased for touch
    }
    return snapThreshold;
  }, [inputMethod, snapThreshold, sensitivityForTouch]);
  
  /**
   * Enhanced point snapping with touch/stylus optimizations
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    try {
      if (!snapEnabled) return { ...point };
      
      // Get the adjusted threshold
      const threshold = getAdjustedThreshold();
      
      // Store the point for debugging
      lastPointerRef.current = { ...point };
      
      // Base snap
      const snappedPoint = baseSnapToGrid(point);
      
      // Calculate distance to nearest grid intersection
      const distX = Math.abs(point.x % gridSize);
      const distY = Math.abs(point.y % gridSize);
      const closeToGridX = Math.min(distX, gridSize - distX) < threshold;
      const closeToGridY = Math.min(distY, gridSize - distY) < threshold;
      
      // If not close to grid, use a blended approach for smoother drawing
      if (!closeToGridX && !closeToGridY) {
        return point;
      } else if (closeToGridX && !closeToGridY) {
        // Snap only X coordinate
        return { x: snappedPoint.x, y: point.y };
      } else if (!closeToGridX && closeToGridY) {
        // Snap only Y coordinate
        return { x: point.x, y: snappedPoint.y };
      }
      
      // Close to grid intersection, snap fully
      return snappedPoint;
    } catch (error) {
      reportDrawingError(error, 'enhanced-snap-point', {
        interaction: { type: inputMethod }
      });
      return baseSnapToGrid(point);
    }
  }, [
    baseSnapToGrid, 
    snapEnabled, 
    gridSize, 
    getAdjustedThreshold, 
    inputMethod, 
    reportDrawingError
  ]);
  
  /**
   * Enhanced line snapping with angle constraints optimization
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    try {
      if (!snapEnabled) return { start: { ...start }, end: { ...end } };
      
      // Get base snapped points
      const baseSnapped = baseSnapLineToGrid(start, end);
      
      // If shift key is pressed, we'll force orthogonal or 45° lines
      // This logic is normally in the keyboard event handlers but we're adding it here too
      if (window.event && (window.event as KeyboardEvent).shiftKey) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Find closest angle multiple of 45°
        const snappedAngle = Math.round(angle / 45) * 45;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate new end point based on angle snap
        const newEndX = start.x + distance * Math.cos(snappedAngle * Math.PI / 180);
        const newEndY = start.y + distance * Math.sin(snappedAngle * Math.PI / 180);
        
        // Snap the new endpoint to grid
        const newEnd = snapPointToGrid({ x: newEndX, y: newEndY });
        
        return { start: baseSnapped.start, end: newEnd };
      }
      
      return baseSnapped;
    } catch (error) {
      reportDrawingError(error, 'enhanced-snap-line', {
        interaction: { type: inputMethod }
      });
      return baseSnapLineToGrid(start, end);
    }
  }, [
    snapPointToGrid, 
    baseSnapLineToGrid, 
    snapEnabled, 
    inputMethod, 
    reportDrawingError
  ]);
  
  /**
   * Process event to determine input method and extract coordinates
   */
  const processPointerEvent = useCallback((event: MouseEvent | TouchEvent): {
    position: Point | null,
    inputType: 'mouse' | 'touch' | 'stylus'
  } => {
    try {
      if (!fabricCanvasRef.current) {
        return { position: null, inputType: 'mouse' };
      }
      
      const canvas = fabricCanvasRef.current;
      
      let clientX, clientY;
      let inputType: 'mouse' | 'touch' | 'stylus' = 'mouse';
      
      // Detect event type and extract coordinates
      if ('touches' in event) {
        // Touch event
        const touch = event.touches[0] || (event.changedTouches && event.changedTouches[0]);
        if (!touch) return { position: null, inputType: 'touch' };
        
        clientX = touch.clientX;
        clientY = touch.clientY;
        
        // Check if it's likely a stylus
        if ((touch as any).touchType === 'stylus' || 
            (touch as any).radiusX < 10 || 
            'force' in touch) {
          inputType = 'stylus';
        } else {
          inputType = 'touch';
        }
      } else {
        // Mouse event
        clientX = event.clientX;
        clientY = event.clientY;
        inputType = 'mouse';
      }
      
      // Update input method state
      setInputMethod(inputType);
      
      // Convert to canvas coordinates
      const canvasElement = canvas.getElement();
      const rect = canvasElement.getBoundingClientRect();
      
      // Apply canvas transformations
      const point = canvas.getPointer({ clientX, clientY } as MouseEvent);
      
      return { 
        position: { x: point.x, y: point.y },
        inputType
      };
    } catch (error) {
      reportDrawingError(error, 'process-pointer-event', {
        interaction: { type: 'unknown' }
      });
      return { position: null, inputType: 'mouse' };
    }
  }, [fabricCanvasRef, reportDrawingError]);
  
  /**
   * Snap a pointer event directly to grid
   */
  const snapEventToGrid = useCallback((event: MouseEvent | TouchEvent): Point | null => {
    try {
      const { position, inputType } = processPointerEvent(event);
      if (!position) return null;
      
      return snapPointToGrid(position);
    } catch (error) {
      reportDrawingError(error, 'snap-event-to-grid', {
        interaction: { type: inputMethod }
      });
      return null;
    }
  }, [processPointerEvent, snapPointToGrid, inputMethod, reportDrawingError]);
  
  // Set up event listeners to detect input method
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const { inputType } = processPointerEvent(e);
      setInputMethod(inputType);
      
      logDrawingEvent(`Input method detected: ${inputType}`, 'input-method-detection', {
        interaction: { type: inputType }
      });
    };
    
    // Add both mouse and touch event listeners
    canvasElement.addEventListener('mousedown', handlePointerDown as any);
    canvasElement.addEventListener('touchstart', handlePointerDown as any, { passive: true });
    
    return () => {
      canvasElement.removeEventListener('mousedown', handlePointerDown as any);
      canvasElement.removeEventListener('touchstart', handlePointerDown as any);
    };
  }, [fabricCanvasRef, processPointerEvent, logDrawingEvent]);
  
  return {
    snapPointToGrid,
    snapLineToGrid,
    snapEventToGrid,
    processPointerEvent,
    inputMethod,
    snapEnabled,
    toggleSnapToGrid,
    lastPointerPosition: lastPointerRef.current
  };
};
