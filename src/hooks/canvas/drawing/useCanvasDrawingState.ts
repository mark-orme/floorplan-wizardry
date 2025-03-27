
/**
 * Custom hook for managing canvas drawing state
 * @module canvas/drawing/useCanvasDrawingState
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { DrawingState, Point } from "@/types";
import { usePointProcessing } from "@/hooks/usePointProcessing";
import { PIXELS_PER_METER } from "@/constants/numerics";
import logger from "@/utils/logger";

/**
 * Props for the useCanvasDrawingState hook
 * @interface UseCanvasDrawingStateProps
 */
interface UseCanvasDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Return type for useCanvasDrawingState hook
 * @interface UseCanvasDrawingStateReturn
 */
interface UseCanvasDrawingStateReturn {
  drawingState: DrawingState;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  cleanupTimeouts: () => void;
  updateZoomLevel: () => void;
}

/**
 * Hook for managing drawing state on the canvas
 * Tracks cursor positions, drawing state, and distances for UI feedback
 * 
 * @param {UseCanvasDrawingStateProps} props - Hook properties
 * @returns {UseCanvasDrawingStateReturn} Drawing state and handlers
 */
export const useCanvasDrawingState = ({
  fabricCanvasRef,
  tool
}: UseCanvasDrawingStateProps): UseCanvasDrawingStateReturn => {
  console.log("useCanvasDrawingState initialized with tool:", tool);
  
  // Initialize drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1,
    points: [],
    distance: null
  });
  
  // Initialize point processing
  const { processPoint, applyGridSnapping, applyStraightening } = usePointProcessing({
    fabricCanvasRef,
    tool
  });
  
  // Refs for timeouts
  const timeoutRefs = useRef<number[]>([]);
  
  /**
   * Calculate the midpoint between two points
   */
  const calculateMidpoint = useCallback((start: Point, current: Point): Point => {
    return {
      x: (start.x + current.x) / 2,
      y: (start.y + current.y) / 2
    };
  }, []);
  
  /**
   * Calculate distance between two points in meters
   */
  const calculateDistance = useCallback((start: Point, current: Point): number => {
    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    return pixelDistance / PIXELS_PER_METER;
  }, []);
  
  /**
   * Handle mouse/touch down event to start drawing
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    console.log("Mouse down event in useCanvasDrawingState");
    
    // Ignore if tool doesn't support drawing
    if (tool === 'select' || tool === 'hand') return;
    
    // Process the point from the event
    const point = processPoint(e);
    if (!point) return;
    
    console.log("Mouse down at point:", point);
    
    // Apply grid snapping if appropriate for the tool
    const snappedPoint = (tool === 'straightLine' || tool === 'wall' || tool === 'room') 
      ? applyGridSnapping(point) 
      : point;
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      midPoint: snappedPoint, // Initially same as start point
      distance: 0,
      points: [snappedPoint]
    }));
    
    console.log("Drawing started at:", snappedPoint);
  }, [tool, processPoint, applyGridSnapping]);
  
  /**
   * Handle mouse/touch move during drawing
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    // Always update cursor position for all tools
    const cursorPoint = processPoint(e);
    
    if (cursorPoint) {
      setDrawingState(prev => ({
        ...prev,
        cursorPosition: cursorPoint
      }));
    }
    
    // Only continue if actively drawing
    if (!drawingState.isDrawing || !drawingState.startPoint) return;
    
    // Get current point from event
    const currentPoint = processPoint(e);
    if (!currentPoint) return;
    
    console.log("Mouse move during drawing, current point:", currentPoint);
    
    // Process the point based on tool
    let processedPoint = currentPoint;
    
    // Apply straightening for certain tools
    if (tool === 'straightLine' || tool === 'wall' || tool === 'room') {
      // First straighten the line if needed
      processedPoint = applyStraightening(drawingState.startPoint, currentPoint);
      
      // Then snap to grid
      processedPoint = applyGridSnapping(processedPoint);
    }
    
    // Calculate midpoint for tooltip positioning
    const midPoint = calculateMidpoint(drawingState.startPoint, processedPoint);
    
    // Calculate distance for tooltip display
    const distance = calculateDistance(drawingState.startPoint, processedPoint);
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      midPoint,
      distance
    }));
    
    console.log("Drawing state updated:", {
      currentPoint: processedPoint,
      midPoint,
      distance
    });
  }, [
    drawingState.isDrawing, 
    drawingState.startPoint, 
    processPoint, 
    tool, 
    applyGridSnapping, 
    applyStraightening, 
    calculateMidpoint, 
    calculateDistance
  ]);
  
  /**
   * Handle mouse/touch up to complete drawing
   */
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    console.log("Mouse up event in useCanvasDrawingState");
    
    // Only process if we were drawing
    if (!drawingState.isDrawing) return;
    
    // If we have an event, get final point
    let finalPoint = drawingState.currentPoint;
    if (e) {
      const processedPoint = processPoint(e);
      if (processedPoint) {
        finalPoint = processedPoint;
        
        // Apply processing based on tool
        if (tool === 'straightLine' || tool === 'wall' || tool === 'room') {
          finalPoint = applyStraightening(drawingState.startPoint!, processedPoint);
          finalPoint = applyGridSnapping(finalPoint);
        }
      }
    }
    
    console.log("Drawing completed:", {
      start: drawingState.startPoint,
      end: finalPoint
    });
    
    // For tools that support lines, the actual line creation will be handled by 
    // the fabric path:created event in useCanvasDrawingEvents
    
    // Reset drawing state but maintain cursor position
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      midPoint: null,
      distance: null,
      points: []
    }));
  }, [
    drawingState.isDrawing, 
    drawingState.currentPoint, 
    drawingState.startPoint, 
    processPoint, 
    tool, 
    applyGridSnapping, 
    applyStraightening
  ]);
  
  /**
   * Update zoom level from canvas
   */
  const updateZoomLevel = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      const zoom = canvas.getZoom ? canvas.getZoom() : 1;
      
      setDrawingState(prev => ({
        ...prev,
        currentZoom: zoom
      }));
      
      console.log("Canvas zoom level updated:", zoom);
    } catch (error) {
      console.error("Error updating zoom level:", error);
    }
  }, [fabricCanvasRef]);
  
  /**
   * Clean up any pending timeouts
   */
  const cleanupTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    timeoutRefs.current = [];
  }, []);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return cleanupTimeouts;
  }, [cleanupTimeouts]);
  
  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts,
    updateZoomLevel
  };
};
