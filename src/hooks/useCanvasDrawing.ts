
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, Path as FabricPath } from "fabric";
import { usePathProcessing } from "./usePathProcessing";
import { useDrawingState } from "./useDrawingState";
import { type FloorPlan } from "@/utils/drawing";
import { DrawingTool } from "./useCanvasState";
import { type DrawingState, type Point } from "@/types/drawingTypes";
import { snapToGrid, metersToPixels, pixelsToMeters } from "@/utils/geometry";
import { GRID_SIZE } from "@/utils/drawing";

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
  
  // Track current zoom level for proper tooltip positioning
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
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
  
  // Update zoom level whenever canvas changes or zoom event fires
  useEffect(() => {
    const updateZoomLevel = () => {
      if (fabricCanvasRef.current) {
        const newZoom = fabricCanvasRef.current.getZoom();
        setCurrentZoom(newZoom);
        console.log("Zoom level updated:", newZoom);
      }
    };
    
    updateZoomLevel();
    
    // Set up listeners for zoom changes - use standard Fabric.js event
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      // Listen to both standard zoom event and object:modified for scaling
      fabricCanvas.on('zoom', updateZoomLevel);
      fabricCanvas.on('object:modified', updateZoomLevel);
    }
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('zoom', updateZoomLevel);
        fabricCanvas.off('object:modified', updateZoomLevel);
      }
    };
  }, [fabricCanvasRef]);
  
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
          
          // First snap both points exactly to the grid
          // Make sure to use GRID_SIZE (0.1m) for the snap
          const snappedStartPoint = snapToGrid(drawingState.startPoint, GRID_SIZE);
          const snappedCurrentPoint = snapToGrid(drawingState.currentPoint, GRID_SIZE);
          
          console.log("Unit Handling:");
          console.log("- Current zoom level:", zoom);
          console.log("- Start point (meters):", drawingState.startPoint);
          console.log("- Snapped start (meters):", snappedStartPoint);
          console.log("- End point (meters):", drawingState.currentPoint);
          console.log("- Snapped end (meters):", snappedCurrentPoint);
          
          // Calculate direction vector between snapped points
          const dx = snappedCurrentPoint.x - snappedStartPoint.x;
          const dy = snappedCurrentPoint.y - snappedStartPoint.y;
          
          // Determine final endpoint based on direction
          let finalEndPoint: Point;
          
          if (Math.abs(dx) > Math.abs(dy)) {
            // Force horizontal line
            finalEndPoint = {
              x: snappedCurrentPoint.x,
              y: snappedStartPoint.y
            };
          } else if (Math.abs(dx) < Math.abs(dy)) {
            // Force vertical line
            finalEndPoint = {
              x: snappedStartPoint.x,
              y: snappedCurrentPoint.y
            };
          } else {
            // Diagonal 45° line - ensure x and y delta match exactly
            const delta = Math.round(dx / GRID_SIZE) * GRID_SIZE;
            finalEndPoint = {
              x: snappedStartPoint.x + delta,
              y: snappedStartPoint.y + delta * Math.sign(dy)
            };
          }
          
          if (e.path && e.path.path) {
            console.log("Wall line processing:");
            console.log("- Original end (meters):", drawingState.currentPoint);
            console.log("- Final grid-aligned end (meters):", finalEndPoint);
            console.log("- Final grid-aligned start (meters):", snappedStartPoint);
            
            // Convert both grid-aligned points to pixels for display
            // No further snapping needed as points are already perfectly aligned
            const startPixels = metersToPixels(snappedStartPoint, zoom);
            const endPixels = metersToPixels(finalEndPoint, zoom);
            
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

  // Return drawing state with current zoom level
  return {
    drawingState: {
      ...drawingState,
      // Add currentZoom to be used by the DistanceTooltip
      currentZoom
    }
  };
};
