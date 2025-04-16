
/**
 * Hook for straight line drawing tool
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Input method enum for different drawing methods
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  PENCIL = 'pencil'
}

/**
 * Props for useLineState hook
 */
export interface UseLineStateProps {
  lineColor: string;
  lineThickness: number;
  canvas?: FabricCanvas | null;
  snapToGrid?: boolean;
  angleConstraint?: boolean;
}

/**
 * Props for useStraightLineTool
 */
export interface UseStraightLineToolProps {
  canvas?: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  snapToGrid?: boolean;
  angleConstraint?: boolean;
}

/**
 * Internal hook for managing line state
 */
export const useLineState = (props: UseLineStateProps) => {
  const { lineColor, lineThickness, canvas, snapToGrid = false, angleConstraint = false } = props;
  
  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<FabricObject | null>(null);
  const [snap, setSnap] = useState(snapToGrid);
  const [angles, setAngles] = useState(angleConstraint);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Refs for improved performance
  const startPointRef = useRef<Point>({ x: 0, y: 0 });
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<FabricObject | null>(null);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnap(prev => !prev);
    toast.info(snap ? 'Grid snapping disabled' : 'Grid snapping enabled');
  }, [snap]);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAngles(prev => !prev);
    toast.info(angles ? 'Angle constraints disabled' : 'Angle constraints enabled');
  }, [angles]);
  
  /**
   * Create a new line
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true, // Changed from false to true for better visibility
      evented: true,   // Changed from false to true to allow interaction
      objectCaching: false,
    });
    
    logger.info('Created line:', { x1, y1, x2, y2, color: lineColor, thickness: lineThickness });
    currentLineRef.current = line;
    return line;
  }, [lineColor, lineThickness]);
  
  /**
   * Create distance tooltip
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    if (!canvas) return null;
    
    // Create text object for tooltip
    const text = new Text(`${distance.toFixed(0)} px`, {
      left: x,
      top: y - 15,
      fontSize: 12,
      fill: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 2,
      selectable: false,
      evented: false
    });
    
    distanceTooltipRef.current = text;
    return text;
  }, [canvas]);
  
  /**
   * Snap point to grid
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snap) return point;
    
    const gridSize = 20; // Grid size in pixels
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snap]);
  
  /**
   * Update line and tooltip
   */
  const updateLineAndTooltip = useCallback((start: Point, end: Point) => {
    if (!canvas) return;
    
    const line = currentLineRef.current;
    if (!line) return;
    
    // Apply angle constraints if enabled
    let constrainedEnd = { ...end };
    if (angles) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Snap to 0, 45, 90, 135, 180, 225, 270, 315 degrees
      const snapAngle = Math.round(angle / 45) * 45;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      constrainedEnd = {
        x: start.x + distance * Math.cos(snapAngle * Math.PI / 180),
        y: start.y + distance * Math.sin(snapAngle * Math.PI / 180)
      };
    }
    
    // Update line
    line.set({
      x2: constrainedEnd.x,
      y2: constrainedEnd.y
    });
    
    // Calculate distance
    const dx = constrainedEnd.x - start.x;
    const dy = constrainedEnd.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update tooltip
    if (distanceTooltipRef.current) {
      const tooltip = distanceTooltipRef.current as Text;
      tooltip.set({
        text: `${distance.toFixed(0)} px`,
        left: (start.x + constrainedEnd.x) / 2,
        top: (start.y + constrainedEnd.y) / 2 - 15
      });
    }
    
    // Ensure line is brought to front
    line.bringToFront();
    
    // Make sure we render after updating
    canvas.renderAll();
  }, [canvas, angles]);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint({ x: 0, y: 0 });
    startPointRef.current = { x: 0, y: 0 };
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  // For measurement display
  const measurementData = {
    isDisplayed: !!distanceTooltipRef.current,
    distance: distanceTooltipRef.current ? 
      parseFloat((distanceTooltipRef.current as Text).text!.split(' ')[0]) : 
      0
  };
  
  // Check if snap grid is enabled
  const snapEnabled = snap;
  const anglesEnabled = angles;
  
  return {
    isDrawing,
    startPoint,
    currentLine,
    distanceTooltip,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    createLine,
    createDistanceTooltip,
    snapPointToGrid,
    updateLineAndTooltip,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    inputMethod,
    setInputMethod,
    isPencilMode,
    setIsPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData
  };
};

/**
 * Hook for straight line drawing tool
 * @param props Hook properties
 * @returns Straight line tool state and functions
 */
export const useStraightLineTool = (props: UseStraightLineToolProps) => {
  const {
    canvas,
    enabled,
    lineColor,
    lineThickness,
    saveCurrentState,
    snapToGrid = false,
    angleConstraint = false
  } = props;
  
  console.log("[useStraightLineTool] Initializing with:", { 
    enabled, 
    lineColor, 
    lineThickness, 
    hasCanvas: !!canvas, 
    snapToGrid, 
    angleConstraint 
  });
  
  // Use line state
  const lineState = useLineState({
    lineColor,
    lineThickness,
    canvas,
    snapToGrid,
    angleConstraint
  });
  
  // Track active status
  const isActive = enabled && !!canvas;
  
  useEffect(() => {
    if (!isActive || !canvas) return;
    
    console.log("Attaching straight line event handlers to canvas", { isActive, isToolInitialized: true });
    
    // Configure canvas for line drawing
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    
    // Make objects non-selectable during line drawing
    canvas.getObjects().forEach(obj => {
      if (obj.type !== 'line') { // Don't affect existing lines
        obj.selectable = false;
      }
    });
    
    // Set up event handlers for canvas
    const handleMouseDown = (e: any) => {
      console.log("Mouse down on canvas", e);
      
      // Get position from fabric event
      const point = {
        x: e.pointer?.x || 0,
        y: e.pointer?.y || 0
      };
      
      handlePointerDown(point);
    };
    
    const handleMouseMove = (e: any) => {
      if (!lineState.isDrawing) return;
      
      // Get position from fabric event
      const point = {
        x: e.pointer?.x || 0,
        y: e.pointer?.y || 0
      };
      
      handlePointerMove(point);
    };
    
    const handleMouseUp = (e: any) => {
      if (!lineState.isDrawing) return;
      
      // Get position from fabric event
      const point = {
        x: e.pointer?.x || 0,
        y: e.pointer?.y || 0
      };
      
      handlePointerUp(point);
    };
    
    // Add fabric canvas event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Add keyboard event listener for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up function
    return () => {
      console.log("[useStraightLineTool] Cleaning up event handlers");
      
      // Remove event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      
      // Reset canvas when tool is deactivated
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      
      // Make objects selectable again
      canvas.getObjects().forEach(obj => {
        if ((obj as any).objectType !== 'grid') {
          obj.selectable = true;
        }
      });
      
      // Cancel any active drawing
      if (lineState.isDrawing) {
        cancelDrawing();
      }
    };
  }, [isActive, canvas]);
  
  /**
   * Handle pointer down event
   */
  const handlePointerDown = useCallback((point: Point) => {
    if (!isActive || !canvas) return;
    
    console.log("[useStraightLineTool] Pointer down:", point);
    
    // Start drawing
    lineState.setIsDrawing(true);
    const snappedPoint = lineState.snapPointToGrid(point);
    lineState.setStartPoint(snappedPoint);
    lineState.startPointRef.current = snappedPoint;
    
    // Create line
    const line = lineState.createLine(snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y);
    if (line) {
      canvas.add(line);
      lineState.setCurrentLine(line);
      console.log("Line created:", line);
      
      // Bring line to front
      line.bringToFront();
      
      // Create tooltip
      const tooltip = lineState.createDistanceTooltip(snappedPoint.x, snappedPoint.y, 0);
      if (tooltip) {
        canvas.add(tooltip);
        lineState.setDistanceTooltip(tooltip);
        tooltip.bringToFront();
      }
      
      // Force render
      canvas.renderAll();
    }
  }, [isActive, canvas, lineState]);
  
  /**
   * Handle pointer move event
   */
  const handlePointerMove = useCallback((point: Point) => {
    if (!isActive || !lineState.isDrawing || !lineState.startPointRef.current || !canvas) return;
    
    // Get snapped point
    const snappedPoint = lineState.snapPointToGrid(point);
    
    // Update line and tooltip
    lineState.updateLineAndTooltip(lineState.startPointRef.current, snappedPoint);
    
    // Ensure canvas renders
    canvas.requestRenderAll();
  }, [isActive, canvas, lineState]);
  
  /**
   * Handle pointer up event
   */
  const handlePointerUp = useCallback((point: Point) => {
    if (!isActive || !lineState.isDrawing || !lineState.startPointRef.current || !canvas) return;
    
    console.log("[useStraightLineTool] Pointer up:", point);
    
    // Get snapped point
    const snappedPoint = lineState.snapPointToGrid(point);
    
    // Update line and tooltip one last time
    lineState.updateLineAndTooltip(lineState.startPointRef.current, snappedPoint);
    
    // Remove distance tooltip
    if (lineState.distanceTooltipRef.current) {
      canvas.remove(lineState.distanceTooltipRef.current);
    }
    
    // Handle line completion
    if (lineState.currentLineRef.current) {
      const currentLine = lineState.currentLineRef.current;
      
      // If the line has no length (same start and end point), remove it
      if (lineState.startPointRef.current.x === snappedPoint.x && 
          lineState.startPointRef.current.y === snappedPoint.y) {
        canvas.remove(currentLine);
      } else {
        // Finalize line properties
        currentLine.set({
          selectable: true,
          evented: true,
          objectType: 'straight-line'
        });
        
        // Bring line to front one more time to ensure visibility
        currentLine.bringToFront();
        
        // Save state for undo
        if (saveCurrentState) {
          saveCurrentState();
        }
        
        // Show toast notification
        toast.success('Line created!');
      }
    }
    
    // Reset drawing state
    lineState.resetDrawingState();
    
    // Render
    canvas.renderAll();
  }, [isActive, canvas, lineState, saveCurrentState]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!lineState.isDrawing || !canvas) return;
    
    console.log("[useStraightLineTool] Drawing cancelled");
    
    // Remove line
    if (lineState.currentLineRef.current) {
      canvas.remove(lineState.currentLineRef.current);
    }
    
    // Remove tooltip
    if (lineState.distanceTooltipRef.current) {
      canvas.remove(lineState.distanceTooltipRef.current);
    }
    
    // Reset drawing state
    lineState.resetDrawingState();
    
    // Render
    canvas.renderAll();
  }, [canvas, lineState]);
  
  return {
    isDrawing: lineState.isDrawing,
    isActive,
    inputMethod: lineState.inputMethod,
    isPencilMode: lineState.isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    measurementData: lineState.measurementData,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping: lineState.toggleSnap,
    toggleAngles: lineState.toggleAngles,
    startPointRef: lineState.startPointRef,
    currentLineRef: lineState.currentLineRef,
    currentLine: lineState.currentLine
  };
};

export type UseStraightLineToolResult = ReturnType<typeof useStraightLineTool>;
