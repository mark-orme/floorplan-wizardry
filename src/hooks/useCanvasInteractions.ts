
/**
 * Canvas interactions hook
 * Manages mouse/touch interactions and drawing state for the canvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/drawingTypes';
import { Point } from '@/types/core/Point';
import { DrawingTool } from '@/constants/drawingModes';
import { usePointProcessing } from './usePointProcessing';
import { useSnapToGrid } from './useSnapToGrid';
import { calculateMidpoint, calculateDistance, formatDistance } from '@/utils/geometry';
import { PIXELS_PER_METER } from '@/constants/numerics';

interface UseCanvasInteractionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool?: DrawingTool;
  lineThickness?: number;
  lineColor?: string;
}

interface UseCanvasInteractionsResult {
  drawingState: DrawingState;
  currentZoom: number;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  resetDrawingState: () => void;
  updateCurrentPoint: (point: Point | null) => void;
  isSnappedToGrid: (point: Point | null) => boolean;
  isLineAutoStraightened: (startPoint: Point | null, endPoint: Point | null) => boolean;
  toggleSnap: () => void;
  snapEnabled: boolean;
}

/**
 * Extract point from event
 * @param e Event object
 * @returns Point object or null
 */
const extractPointFromEvent = (e: MouseEvent | TouchEvent): { x: number, y: number } | null => {
  if ('touches' in e) {
    // Touch event
    if (e.touches.length === 0) {
      // Use changedTouches for touchend events
      if (!e.changedTouches || e.changedTouches.length === 0) {
        return null;
      }
      return { 
        x: e.changedTouches[0].clientX, 
        y: e.changedTouches[0].clientY 
      };
    }
    return { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
  } else {
    // Mouse event
    return { 
      x: e.clientX, 
      y: e.clientY 
    };
  }
};

/**
 * Hook for managing canvas drawing interactions
 * Handles mouse/touch events, maintains drawing state, and provides snapping functionality
 * 
 * @param props - Hook configuration properties
 * @returns Object containing drawing state and interaction handlers
 */
export const useCanvasInteractions = ({
  fabricCanvasRef,
  tool = 'select',
  lineThickness = 2,
  lineColor = '#000000'
}: UseCanvasInteractionsProps): UseCanvasInteractionsResult => {
  // Initialize drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());

  // Point processing utilities
  const { processPoint } = usePointProcessing({ fabricCanvasRef });
  
  // Grid snapping utilities
  const {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid: checkIsSnappedToGrid,
    isAutoStraightened: checkIsAutoStraightened
  } = useSnapToGrid();

  // Track timeouts for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Reset drawing state to initial values
   */
  const resetDrawingState = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      midPoint: null,
      points: [],
      distance: null
    }));
  }, []);

  /**
   * Update current point in drawing state
   * Also updates midpoint if start point exists
   * 
   * @param point - New current point or null
   */
  const updateCurrentPoint = useCallback((point: Point | null) => {
    setDrawingState(prev => {
      // Calculate midpoint if we have a start and current point
      const midPoint = prev.startPoint && point
        ? calculateMidpoint(prev.startPoint, point)
        : null;
        
      // Calculate distance in meters for tooltip
      let distance = null;
      if (prev.startPoint && point) {
        const pixelDistance = calculateDistance(prev.startPoint, point);
        distance = pixelDistance / PIXELS_PER_METER;
      }
        
      return {
        ...prev,
        currentPoint: point,
        cursorPosition: point, // Also update cursor position
        midPoint,
        distance
      };
    });
  }, []);

  /**
   * Process point from event
   * Helper function to handle the event processing
   */
  const processEventPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    const eventPoint = extractPointFromEvent(e);
    if (!eventPoint) return null;
    
    // Convert to canvas coordinates
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    
    const x = eventPoint.x - rect.left;
    const y = eventPoint.y - rect.top;
    
    // Apply canvas transformations
    const point = canvas.getPointer({ clientX: eventPoint.x, clientY: eventPoint.y } as MouseEvent);
    
    return { x: point.x, y: point.y } as Point;
  }, [fabricCanvasRef]);

  /**
   * Handle mouse/touch down events
   * Starts drawing process and sets initial point
   * 
   * @param e - Mouse or touch event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (tool === 'select' || tool === 'hand') return;
    
    console.log("Mouse down with tool:", tool);
    
    // Process point from event
    const point = processEventPoint(e);
    if (!point) return;
    
    // Snap point to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      midPoint: null,
      distance: 0
    }));
    
    console.log("Drawing started at:", snappedPoint);
  }, [tool, processEventPoint, snapPointToGrid, snapEnabled]);

  /**
   * Handle mouse/touch move events
   * Updates current drawing point and applies snapping if enabled
   * 
   * @param e - Mouse or touch event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    // Always update cursor position regardless of drawing state
    const point = processEventPoint(e);
    if (!point) return;
    
    setDrawingState(prev => ({
      ...prev,
      cursorPosition: point
    }));
    
    // Only update drawing points if actively drawing
    if (!drawingState.isDrawing || tool === 'select' || tool === 'hand') return;
    
    // Apply grid snapping and angle constraints based on tool
    let processedPoint = point;
    
    if ((tool === 'straightLine' || tool === 'wall') && snapEnabled) {
      // For line tools, snap to grid first
      const snappedPoint = snapPointToGrid(point);
      
      // Then snap to standard angles if we have a start point
      if (drawingState.startPoint) {
        processedPoint = snapLineToGrid(drawingState.startPoint, snappedPoint);
      } else {
        processedPoint = snappedPoint;
      }
    } else if (snapEnabled) {
      // For other tools, just snap to grid
      processedPoint = snapPointToGrid(point);
    } else {
      processedPoint = point;
    }
    
    // Calculate midpoint for tooltip positioning
    const midPoint = drawingState.startPoint 
      ? calculateMidpoint(drawingState.startPoint, processedPoint)
      : null;
    
    // Calculate distance in meters for tooltip
    let distance = null;
    if (drawingState.startPoint && processedPoint) {
      const pixelDistance = calculateDistance(drawingState.startPoint, processedPoint);
      distance = pixelDistance / PIXELS_PER_METER;
    }
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      midPoint,
      distance
    }));
  }, [drawingState.isDrawing, drawingState.startPoint, tool, processEventPoint, snapPointToGrid, snapLineToGrid, snapEnabled]);

  /**
   * Handle mouse/touch up events
   * Completes current drawing action
   * 
   * @param e - Mouse or touch event
   */
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    if (!drawingState.isDrawing || tool === 'select' || tool === 'hand') return;
    
    console.log("Mouse up with tool:", tool);
    
    // If no event is provided, use the existing current point
    let finalPoint = drawingState.currentPoint;
    
    // If event is provided, process the final point
    if (e) {
      const point = processEventPoint(e);
      if (point) {
        // Apply final snapping if needed
        if ((tool === 'straightLine' || tool === 'wall') && snapEnabled) {
          const snappedPoint = snapPointToGrid(point);
          
          if (drawingState.startPoint) {
            finalPoint = snapLineToGrid(drawingState.startPoint, snappedPoint);
          } else {
            finalPoint = snappedPoint;
          }
        } else if (snapEnabled) {
          finalPoint = snapPointToGrid(point);
        } else {
          finalPoint = point;
        }
      }
    }
    
    // Only proceed if we have both start and final points
    if (drawingState.startPoint && finalPoint) {
      // Calculate final midpoint
      const midPoint = calculateMidpoint(drawingState.startPoint, finalPoint);
      
      // Calculate final distance in meters
      const pixelDistance = calculateDistance(drawingState.startPoint, finalPoint);
      const distance = pixelDistance / PIXELS_PER_METER;
      
      // Update drawing state with final point
      setDrawingState(prev => ({
        ...prev,
        currentPoint: finalPoint,
        midPoint,
        distance,
        isDrawing: false
      }));
      
      console.log("Drawing completed:", { 
        start: drawingState.startPoint, 
        end: finalPoint,
        distance: `${distance.toFixed(1)}m`,
        tool
      });
    } else {
      // Reset drawing state if missing points
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false
      }));
    }
    
    // Clear drawing state after a delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      resetDrawingState();
    }, 500);
  }, [drawingState.isDrawing, drawingState.startPoint, drawingState.currentPoint, tool, processEventPoint, snapPointToGrid, snapLineToGrid, resetDrawingState, snapEnabled]);

  /**
   * Clean up any pending timeouts when component unmounts
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Check if a point is snapped to grid
   * Wrapper around the snapToGrid utility function
   * 
   * @param point - Point to check
   * @returns Boolean indicating if point is snapped
   */
  const isSnappedToGrid = useCallback((point: Point | null): boolean => {
    if (!point || !snapEnabled) return false;
    return checkIsSnappedToGrid(point, point);
  }, [checkIsSnappedToGrid, snapEnabled]);

  /**
   * Check if a line is auto-straightened
   * Wrapper around the isAutoStraightened utility function
   * 
   * @param startPoint - Line start point
   * @param endPoint - Line end point
   * @returns Boolean indicating if line is straightened
   */
  const isLineAutoStraightened = useCallback((startPoint: Point | null, endPoint: Point | null): boolean => {
    if (!startPoint || !endPoint || !snapEnabled) return false;
    return checkIsAutoStraightened(startPoint, endPoint, endPoint);
  }, [checkIsAutoStraightened, snapEnabled]);

  return {
    drawingState,
    currentZoom: drawingState.currentZoom || 1,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetDrawingState,
    updateCurrentPoint,
    isSnappedToGrid,
    isLineAutoStraightened,
    toggleSnap,
    snapEnabled
  };
};
