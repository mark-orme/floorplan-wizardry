
/**
 * Canvas interactions hook
 * Manages mouse/touch interactions and drawing state for the canvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingState, Point } from '@/types/drawingTypes';
import { DrawingTool } from './useCanvasState';
import { usePointProcessing } from './usePointProcessing';
import { useSnapToGrid } from './useSnapToGrid';
import { calculateMidpoint } from '@/utils/geometry';

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
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  resetDrawingState: () => void;
  updateCurrentPoint: (point: Point | null) => void;
  isSnappedToGrid: (point: Point | null) => boolean;
  isLineAutoStraightened: (startPoint: Point | null, endPoint: Point | null) => boolean;
  toggleSnap: () => void;
  snapEnabled: boolean;
}

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
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1
  });

  // Point processing utilities
  const { processPoint } = usePointProcessing({ fabricCanvasRef, tool });
  
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
      midPoint: null
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
        
      return {
        ...prev,
        currentPoint: point,
        cursorPosition: point, // Also update cursor position
        midPoint
      };
    });
  }, []);

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
    const point = processPoint(e);
    if (!point) return;
    
    // Snap point to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      midPoint: null
    }));
    
    console.log("Drawing started at:", snappedPoint);
  }, [tool, processPoint, snapPointToGrid, snapEnabled]);

  /**
   * Handle mouse/touch move events
   * Updates current drawing point and applies snapping if enabled
   * 
   * @param e - Mouse or touch event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    // Always update cursor position regardless of drawing state
    const point = processPoint(e);
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
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      midPoint
    }));
  }, [drawingState.isDrawing, drawingState.startPoint, tool, processPoint, snapPointToGrid, snapLineToGrid, snapEnabled]);

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
      const point = processPoint(e);
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
      
      // Update drawing state with final point
      setDrawingState(prev => ({
        ...prev,
        currentPoint: finalPoint,
        midPoint,
        isDrawing: false
      }));
      
      console.log("Drawing completed:", { 
        start: drawingState.startPoint, 
        end: finalPoint,
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
  }, [drawingState.isDrawing, drawingState.startPoint, drawingState.currentPoint, tool, processPoint, snapPointToGrid, snapLineToGrid, resetDrawingState, snapEnabled]);

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
   * Update zoom level from canvas
   */
  const updateZoomLevel = useCallback((zoom: number) => {
    setDrawingState(prev => ({
      ...prev,
      currentZoom: zoom
    }));
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
