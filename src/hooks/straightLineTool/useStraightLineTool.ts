
/**
 * Straight line drawing tool hook
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useRef, useEffect } from "react";
import { Canvas, Line } from "fabric";
import { useLineState, InputMethod } from "./useLineState";
import { useLineToolHandlers } from "./useLineToolHandlers";
import { Point } from "@/types/core/Geometry";

/**
 * Props for the straight line tool hook
 */
interface UseStraightLineToolProps {
  /**
   * Reference to the fabric canvas
   */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /**
   * Whether the tool is enabled
   */
  enabled: boolean;
  /**
   * Line color
   */
  lineColor: string;
  /**
   * Line thickness
   */
  lineThickness: number;
  /**
   * Callback for saving the current state
   */
  saveCurrentState?: () => void;
}

/**
 * Props for line tool handlers
 */
interface UseLineToolHandlersProps {
  /**
   * Reference to the fabric canvas
   */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /**
   * Whether the tool is enabled
   */
  enabled: boolean;
  /**
   * Line state from useLineState hook
   */
  lineState: ReturnType<typeof useLineState>;
  /**
   * Callback for saving the current state
   */
  saveCurrentState?: () => void;
}

/**
 * Hook for drawing straight lines on canvas
 * @param props - Hook properties 
 */
export const useStraightLineTool = (props: UseStraightLineToolProps) => {
  const { 
    fabricCanvasRef, 
    enabled, 
    lineColor, 
    lineThickness, 
    saveCurrentState 
  } = props;
  
  // Use the line state hook
  const lineState = useLineState({ 
    fabricCanvasRef, 
    lineColor, 
    lineThickness 
  });
  
  // Use the line tool handlers
  useLineToolHandlers({
    fabricCanvasRef,
    enabled,
    lineState,
    saveCurrentState
  });
  
  const {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsDrawing,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    initializeTool,
    resetDrawingState,
    snapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    toggleSnap,
    inputMethod,
    setInputMethod
  } = lineState;
  
  // Initialize the tool when enabled
  useEffect(() => {
    if (enabled && !isToolInitialized) {
      initializeTool();
    }
  }, [enabled, isToolInitialized, initializeTool]);
  
  // Set up event handlers for canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !enabled) return;
    
    // Set cursor style
    canvas.defaultCursor = 'crosshair';
    
    // Function to handle pointer down event
    const handlePointerDown = (event: any) => {
      if (!enabled) return;
      
      // Get input method
      const isTouch = event.e && event.e.type.includes('touch');
      const isStylus = event.e && event.e.pointerType === 'pen';
      setInputMethod(isStylus ? InputMethod.PENCIL : isTouch ? InputMethod.TOUCH : InputMethod.MOUSE);
      
      // Get pointer coordinates
      let pointer = canvas.getPointer(event.e);
      
      // Snap to grid if enabled
      pointer = snapPointToGrid(pointer);
      
      // Set start point and create line
      setIsDrawing(true);
      
      // Convert to the simple Point type from Geometry not the Fabric Point
      const geometryPoint: Point = { 
        x: pointer.x, 
        y: pointer.y 
      };
      
      setStartPoint(geometryPoint);
      
      const line = createLine(pointer.x, pointer.y, pointer.x, pointer.y);
      setCurrentLine(line);
      
      // Create distance tooltip
      const tooltip = createDistanceTooltip(pointer.x, pointer.y, 0);
      setDistanceTooltip(tooltip);
      
      // Add objects to canvas
      canvas.add(line, tooltip);
    };
    
    // Function to handle pointer move event
    const handlePointerMove = (event: any) => {
      if (!enabled || !isDrawing || !startPointRef.current) return;
      
      // Get pointer coordinates
      let pointer = canvas.getPointer(event.e);
      
      // Snap to grid if enabled
      pointer = snapPointToGrid(pointer);
      
      // Convert to our geometry Point type
      const geometryPoint: Point = {
        x: pointer.x,
        y: pointer.y
      };
      
      // Update line and tooltip
      updateLineAndTooltip(startPointRef.current, geometryPoint);
      
      // Request render
      canvas.requestRenderAll();
    };
    
    // Function to handle pointer up event
    const handlePointerUp = () => {
      if (!enabled || !isDrawing || !startPointRef.current || !currentLineRef.current || !distanceTooltipRef.current) return;
      
      // Snap line to grid
      const { start, end } = snapLineToGrid(startPointRef.current, {
        x: (currentLineRef.current as Line).x2 || 0,
        y: (currentLineRef.current as Line).y2 || 0
      });
      
      // Update line and tooltip
      updateLineAndTooltip(start, end);
      
      // Remove tooltip
      canvas.remove(distanceTooltipRef.current);
      
      // Reset drawing state
      setIsDrawing(false);
      resetDrawingState();
      
      // Save state
      saveCurrentState?.();
    };
    
    // Add event listeners
    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);
    
    // Clean up event listeners
    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
    };
  }, [
    fabricCanvasRef,
    enabled,
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    snapPointToGrid,
    snapLineToGrid,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    resetDrawingState,
    saveCurrentState,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setInputMethod
  ]);
  
  return {
    isDrawing,
    isActive: enabled,
    inputMethod,
    isPencilMode: inputMethod === InputMethod.PENCIL,
    snapEnabled,
    anglesEnabled: false,
    measurementData: {
      distance: null,
      angle: null
    },
    handlePointerDown: (point: any) => {
      //console.log('Pointer down at', point);
    },
    handlePointerMove: (point: any) => {
      //console.log('Pointer move to', point);
    },
    handlePointerUp: (point: any) => {
      //console.log('Pointer up at', point);
    },
    cancelDrawing: () => {
      //console.log('Drawing cancelled');
    },
    toggleGridSnapping: () => {
      toggleSnap();
    },
    toggleAngles: () => {
      //console.log('Angles toggled');
    },
    startPointRef,
    currentLineRef,
    currentLine: currentLineRef.current
  };
};
