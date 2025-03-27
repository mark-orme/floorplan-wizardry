
/**
 * Custom hook for handling canvas drawing interactions
 * Manages drawing state, tooltips, and interaction with the canvas
 * @module useCanvasInteractions
 */
import { useCallback, useEffect, useState, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { DrawingState, Point } from "@/types/drawingTypes";
import { usePointProcessing } from "./usePointProcessing";
import { useSnapToGrid } from "./useSnapToGrid";
import { calculateMidpoint } from "@/utils/geometry";
import { isTouchEvent } from "@/utils/fabric";

/**
 * Props for the useCanvasInteractions hook
 * @interface UseCanvasInteractionsProps
 */
interface UseCanvasInteractionsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Current line thickness */
  lineThickness?: number;
  /** Current line color */
  lineColor?: string;
}

/**
 * Return type for useCanvasInteractions hook
 * @interface UseCanvasInteractionsReturn
 */
interface UseCanvasInteractionsReturn {
  /** Current drawing state */
  drawingState: DrawingState;
  /** Current zoom level */
  currentZoom: number;
  /** Handle mouse/touch down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse/touch move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse/touch up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  /** Whether the current point is snapped to grid */
  isSnappedToGrid: boolean;
  /** Whether the current line is auto-straightened */
  isAutoStraightened: boolean;
  /** Toggle grid snapping on/off */
  toggleSnap: () => void;
  /** Whether snapping to grid is enabled */
  snapEnabled: boolean;
}

/**
 * Hook for managing canvas drawing interactions and state
 * Handles drawing state, tooltips, and various drawing tools
 * 
 * @param {UseCanvasInteractionsProps} props - Hook properties
 * @returns {UseCanvasInteractionsReturn} Drawing state and handlers
 */
export const useCanvasInteractions = ({
  fabricCanvasRef,
  tool,
  lineThickness = 2,
  lineColor = "#000000"
}: UseCanvasInteractionsProps): UseCanvasInteractionsReturn => {
  // Initialize the drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1
  });
  
  // Track current zoom level
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  // Track if point is snapped or straightened
  const [isSnappedToGrid, setIsSnappedToGrid] = useState<boolean>(false);
  const [isAutoStraightened, setIsAutoStraightened] = useState<boolean>(false);
  
  // Track original points before snapping for comparison
  const originalPointRef = useRef<Point | null>(null);
  
  // Get point processing utilities
  const { processPoint } = usePointProcessing({
    fabricCanvasRef,
    tool
  });
  
  // Get grid snapping utilities
  const {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid: checkSnapToGrid,
    isAutoStraightened: checkAutoStraightened
  } = useSnapToGrid();
  
  /**
   * Handle mouse/touch down event to start drawing
   * Captures the start point and initializes drawing state
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Only handle drawing tools (not selection or hand tools)
    if (tool === 'select' || tool === 'hand') return;
    
    // Get the point from the event
    const point = processPoint(e);
    if (!point) return;
    
    // Store original unsnapped point for comparison
    originalPointRef.current = { ...point };
    
    // Apply grid snapping if needed
    const snappedPoint = snapPointToGrid(point);
    
    // Check if point was snapped
    setIsSnappedToGrid(checkSnapToGrid(snappedPoint, point));
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      cursorPosition: point, // Keep original cursor position for tooltip
      midPoint: null
    }));
    
    // Prevent default action
    if (e.preventDefault) e.preventDefault();
  }, [fabricCanvasRef, tool, processPoint, snapPointToGrid, checkSnapToGrid]);
  
  /**
   * Handle mouse/touch move event while drawing
   * Updates current point and midpoint for drawing tools
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Get the point from the event
    const point = processPoint(e);
    if (!point) return;
    
    // Always update cursor position for tooltip placement
    setDrawingState(prev => ({
      ...prev,
      cursorPosition: point
    }));
    
    // Only continue if actively drawing
    if (!drawingState.isDrawing || !drawingState.startPoint) return;
    
    // Store original unsnapped point for comparison
    originalPointRef.current = { ...point };
    
    // Apply different processing based on the tool
    let processedPoint = point;
    
    if (tool === 'wall' || tool === 'straightLine' || tool === 'room') {
      // For tools that need grid snapping and straightening
      processedPoint = snapPointToGrid(point);
      
      // For tools that need line straightening
      if (drawingState.startPoint) {
        processedPoint = snapLineToGrid(drawingState.startPoint, processedPoint);
        
        // Check if line was straightened
        setIsAutoStraightened(
          checkAutoStraightened(
            drawingState.startPoint,
            processedPoint,
            originalPointRef.current
          )
        );
      }
      
      // Check if point was snapped
      setIsSnappedToGrid(checkSnapToGrid(processedPoint, point));
    }
    
    // Calculate midpoint for tooltip positioning
    const midPoint = drawingState.startPoint
      ? calculateMidpoint(drawingState.startPoint, processedPoint)
      : null;
    
    // Update drawing state with processed point
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      midPoint
    }));
    
    // Prevent default to avoid scrolling while drawing
    if (e.preventDefault && !isTouchEvent(e)) {
      e.preventDefault();
    }
  }, [
    fabricCanvasRef,
    drawingState.isDrawing,
    drawingState.startPoint,
    processPoint,
    tool,
    snapPointToGrid,
    snapLineToGrid,
    checkSnapToGrid,
    checkAutoStraightened
  ]);
  
  /**
   * Handle mouse/touch up event to complete drawing
   * Finalizes the drawing operation
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event (optional)
   */
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    // Process the event point if provided
    let finalPoint = null;
    if (e) {
      finalPoint = processPoint(e);
      if (finalPoint && drawingState.startPoint) {
        // Apply grid snapping and straightening
        if (tool === 'wall' || tool === 'straightLine' || tool === 'room') {
          finalPoint = snapPointToGrid(finalPoint);
          finalPoint = snapLineToGrid(drawingState.startPoint, finalPoint);
        }
      }
    }
    
    // Reset drawing state but maintain the final points for reference
    // This allows the tooltip to remain visible briefly after drawing
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      currentPoint: finalPoint || prev.currentPoint
    }));
    
    // Reset snapped states after drawing completes
    setIsSnappedToGrid(false);
    setIsAutoStraightened(false);
    
    // Reset original point reference
    originalPointRef.current = null;
    
    // Prevent default if event provided
    if (e && e.preventDefault) e.preventDefault();
  }, [
    processPoint,
    drawingState.startPoint,
    tool,
    snapPointToGrid,
    snapLineToGrid
  ]);
  
  /**
   * Update the current zoom level from the canvas
   * This ensures tooltips are positioned correctly at any zoom level
   */
  const updateZoomLevel = useCallback(() => {
    if (fabricCanvasRef.current) {
      const zoom = fabricCanvasRef.current.getZoom();
      setCurrentZoom(zoom);
      
      // Update drawing state with new zoom
      setDrawingState(prev => ({
        ...prev,
        currentZoom: zoom
      }));
    }
  }, [fabricCanvasRef]);
  
  // Track canvas zoom changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Custom event type for canvas events
    type CanvasEventHandler = (options: unknown) => void;
    
    // Event handler for zoom changes
    const handleZoomChange: CanvasEventHandler = () => {
      updateZoomLevel();
    };
    
    // Add event listeners for zoom changes
    canvas.on('zoom:changed', handleZoomChange as any);
    canvas.on('viewport:transform', handleZoomChange as any);
    
    // Initial zoom level
    updateZoomLevel();
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        canvas.off('zoom:changed', handleZoomChange as any);
        canvas.off('viewport:transform', handleZoomChange as any);
      }
    };
  }, [fabricCanvasRef, updateZoomLevel]);
  
  return {
    drawingState,
    currentZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isSnappedToGrid,
    isAutoStraightened,
    toggleSnap,
    snapEnabled
  };
};
