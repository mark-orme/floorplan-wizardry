
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useEffect, useMemo } from "react";
import { usePathProcessing } from "./usePathProcessing";
import { useDrawingState } from "./useDrawingState";
import { type FloorPlan } from "@/utils/drawing";
import { DrawingTool } from "./useCanvasState";

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
}

/**
 * Hook for handling all drawing-related operations on the canvas
 * @param {UseCanvasDrawingProps} props - Hook properties
 * @returns {Object} Drawing state and handlers
 */
export const useCanvasDrawing = (props: UseCanvasDrawingProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness = 2,
    lineColor = "#000000"
  } = props;
  
  // Composition of smaller, focused hooks - always initialize hooks first
  const { processCreatedPath } = usePathProcessing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor
  });
  
  // Always initialize this hook, never conditionally
  const {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  } = useDrawingState({ 
    fabricCanvasRef,
    tool  // Pass tool to useDrawingState to enable proper drawing state tracking
  });
  
  /**
   * Set up event listeners for canvas drawing
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Update the brush settings whenever they change
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
    // Handle path creation (called by fabric when a path is completed)
    const handlePathCreated = (e: { path: any }) => {
      processCreatedPath(e.path);
      // Reset drawing state at the end of drawing
      handleMouseUp();
    };
    
    // Only attach drawing-related event handlers if we're not in hand tool mode
    if (tool !== "hand") {
      // Attach event listeners
      fabricCanvas.on('path:created', handlePathCreated);
      fabricCanvas.on('mouse:down', handleMouseDown);
      fabricCanvas.on('mouse:move', handleMouseMove);
      fabricCanvas.on('mouse:up', handleMouseUp);
    }
    
    // Clean up event listeners on unmount or when tool changes
    return () => {
      cleanupTimeouts();
      
      if (fabricCanvas) {
        fabricCanvas.off('path:created', handlePathCreated);
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [
    fabricCanvasRef, 
    processCreatedPath, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp,
    cleanupTimeouts,
    tool,
    lineThickness,
    lineColor
  ]);

  return {
    drawingState
  };
};
