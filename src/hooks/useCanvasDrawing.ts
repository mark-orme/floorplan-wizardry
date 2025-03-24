
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
import { snapToAngle } from "@/utils/fabricInteraction";
import { toFabricPoint } from "@/utils/fabricPointConverter";
import { type DrawingState } from "@/types/drawingTypes";
import { snapToGrid } from "@/utils/geometry";

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
    tool
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
      console.log("Path created event triggered");
      
      // Apply automatic straightening for straightLine tool
      if (tool === "straightLine" && drawingState.startPoint && drawingState.currentPoint) {
        console.log("Applying strict grid alignment to wall line");
        try {
          // CRITICAL FIX: Apply grid snapping to both points BEFORE angle snapping
          const snappedStartPoint = snapToGrid(drawingState.startPoint);
          const snappedCurrentPoint = snapToGrid(drawingState.currentPoint);
          
          // Create perfectly aligned wall line with exact grid positioning
          const straightenedEndPoint = snapToAngle(
            snappedStartPoint, 
            snappedCurrentPoint,
            8 // Reduced threshold for better wall precision (8 degrees)
          );
          
          // CRITICAL FIX: Apply final grid snapping to ensure perfect grid alignment
          const gridSnappedEndPoint = snapToGrid(straightenedEndPoint);
          
          // Replace the end point with the straightened one
          if (gridSnappedEndPoint && e.path && e.path.path) {
            console.log("Wall line snapped from", drawingState.currentPoint, 
                        "to angle-adjusted", straightenedEndPoint,
                        "to final grid-snapped", gridSnappedEndPoint);
            
            // Convert meters to pixels for the path
            const startX = snappedStartPoint.x * 100; // Convert to pixels
            const startY = snappedStartPoint.y * 100;
            const endX = gridSnappedEndPoint.x * 100;
            const endY = gridSnappedEndPoint.y * 100;
            
            // Create a perfectly straight line with just two points
            e.path.path = [
              ["M", startX, startY],
              ["L", endX, endY]
            ];
            
            // Force redraw
            fabricCanvas.requestRenderAll();
          }
        } catch (err) {
          console.error("Error straightening wall line:", err);
        }
      }
      
      processCreatedPath(e.path);
      // Reset drawing state at the end of drawing
      handleMouseUp();
    };
    
    // Only attach event handlers if canvas exists
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
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
    lineColor,
    drawingState
  ]);

  return {
    drawingState
  };
};
