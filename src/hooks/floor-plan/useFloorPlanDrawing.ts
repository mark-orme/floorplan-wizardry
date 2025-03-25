
/**
 * Main hook for floor plan drawing
 * Coordinates drawing operations with optimized rendering
 * @module useFloorPlanDrawing
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanBatchProcessing } from "./useFloorPlanBatchProcessing";
import { useFloorPlanChunkProcessing } from "./useFloorPlanChunkProcessing";

interface UseFloorPlanDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  floorChangeInProgressRef?: React.MutableRefObject<boolean>;
}

/**
 * Hook that handles drawing floor plans on the canvas
 */
export const useFloorPlanDrawing = ({
  fabricCanvasRef,
  gridLayerRef,
  createGrid,
  floorChangeInProgressRef = useRef(false)
}: UseFloorPlanDrawingProps) => {
  const lastDrawnFloorRef = useRef<number | null>(null);
  
  // Initialize batch processing hook
  const { 
    batchedDrawOpsRef,
    animFrameRef,
    processBatchedDrawing
  } = useFloorPlanBatchProcessing({
    fabricCanvasRef,
    gridLayerRef
  });
  
  // Initialize chunk processing hook
  const { 
    processFloorPlanInChunks 
  } = useFloorPlanChunkProcessing({
    fabricCanvasRef,
    gridLayerRef,
    floorChangeInProgressRef
  });

  /**
   * Draw a floor plan on the canvas with optimized rendering
   */
  const drawFloorPlan = useCallback((currentFloor: number, floorPlans: FloorPlan[]) => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot draw floor plan: fabric canvas is null");
      return;
    }
    
    const currentPlan = floorPlans[currentFloor];
    if (!currentPlan) {
      console.error("Cannot draw floor plan: no plan data for current floor");
      return;
    }
    
    // Skip redraw if already drawing this floor
    if (lastDrawnFloorRef.current === currentFloor && 
        fabricCanvasRef.current.getObjects().length > gridLayerRef.current.length) {
      return;
    }
    
    // Update the last drawn floor
    lastDrawnFloorRef.current = currentFloor;
    
    if (gridLayerRef.current.length === 0) {
      createGrid(fabricCanvasRef.current);
    }
    
    // Clear any pending batched operations
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    batchedDrawOpsRef.current = [];
    
    fabricCanvasRef.current.renderOnAddRemove = false;
    
    // OPTIMIZATION: Ensure grid is at the back
    gridLayerRef.current.forEach(gridObj => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.sendObjectToBack(gridObj);
      }
    });
    
    // Process floor plan strokes
    const totalStrokes = currentPlan.strokes.length;
    
    // Only log if we actually have strokes to draw
    if (totalStrokes > 0) {
      console.log(`Drawing ${totalStrokes} strokes for floor plan`);
    }
    
    processFloorPlanInChunks(currentPlan.strokes, totalStrokes);
    
  }, [
    fabricCanvasRef, 
    gridLayerRef, 
    createGrid, 
    animFrameRef, 
    batchedDrawOpsRef, 
    processFloorPlanInChunks
  ]);

  return {
    drawFloorPlan,
    processBatchedDrawing,
    lastDrawnFloorRef,
    floorChangeInProgressRef
  };
};
