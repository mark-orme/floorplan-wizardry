
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath } from "fabric";
import { usePathProcessing } from "./usePathProcessing";
import { useDrawingState } from "./useDrawingState";
import { type FloorPlan } from "@/utils/drawing";
import { DrawingTool } from "./useCanvasState";
import { snapToAngle } from "@/utils/fabricInteraction";
import { type DrawingState, type Point } from "@/types/drawingTypes";
import { snapToGrid, metersToPixels, pixelsToMeters } from "@/utils/geometry";
import { PIXELS_PER_METER, GRID_SIZE } from "@/utils/drawing";

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricPath[]>;
  historyRef: React.MutableRefObject<{past: FabricPath[][], future: FabricPath[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
}

interface PathCreatedEvent {
  path: FabricPath;
}

/**
 * Hook for handling all drawing-related operations on the canvas
 * @param {UseCanvasDrawingProps} props - Hook properties
 * @returns {Object} Drawing state and handlers
 */
export const useCanvasDrawing = (props: UseCanvasDrawingProps): { drawingState: DrawingState } => {
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
  
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
    const handlePathCreated = (e: PathCreatedEvent): void => {
      console.log("Path created event triggered");
      
      if (tool === "straightLine" && drawingState.startPoint && drawingState.currentPoint) {
        console.log("Applying strict grid alignment to wall line");
        try {
          const zoom = fabricCanvas.getZoom();
          
          const snappedStartPoint = snapToGrid(drawingState.startPoint);
          const snappedCurrentPoint = snapToGrid(drawingState.currentPoint);
          
          console.log("Unit Handling:");
          console.log("- Current zoom level:", zoom);
          console.log("- Start point (meters):", drawingState.startPoint);
          console.log("- Snapped start (meters):", snappedStartPoint);
          console.log("- End point (meters):", drawingState.currentPoint);
          console.log("- Snapped end (meters):", snappedCurrentPoint);
          
          // Force snap both points to grid lines before calculating angle
          const gridSnappedStartPoint = snapToGrid(snappedStartPoint, GRID_SIZE);
          
          // Calculate straightened end point based on angle snapping
          const straightenedEndPoint = snapToAngle(
            gridSnappedStartPoint,
            snappedCurrentPoint,
            8
          );
          
          // Force snap the end point to grid lines after angle calculation
          const gridSnappedEndPoint = snapToGrid(straightenedEndPoint, GRID_SIZE);
          
          if (gridSnappedEndPoint && e.path && e.path.path) {
            console.log("Wall line processing:");
            console.log("- Original end (meters):", drawingState.currentPoint);
            console.log("- Angle-adjusted (meters):", straightenedEndPoint);
            console.log("- Final grid-snapped (meters):", gridSnappedEndPoint);
            console.log("- Final start-snapped (meters):", gridSnappedStartPoint);
            
            // Convert both grid-aligned points to pixels for display
            const startPixels = metersToPixels(gridSnappedStartPoint, zoom);
            const endPixels = metersToPixels(gridSnappedEndPoint, zoom);
            
            console.log("Pixel conversion for rendering:");
            console.log("- Start pixels:", startPixels);
            console.log("- End pixels:", endPixels);
            
            // Create a perfectly aligned wall line with just two points
            e.path.path = [
              ["M", startPixels.x, startPixels.y],
              ["L", endPixels.x, endPixels.y]
            ];
            
            fabricCanvas.requestRenderAll();
          }
        } catch (err) {
          console.error("Error straightening wall line:", err);
        }
      }
      
      processCreatedPath(e.path);
      handleMouseUp();
    };
    
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
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
