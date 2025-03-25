
/**
 * Custom hook for optimized batch processing of floor plan rendering
 * @module useFloorPlanBatchProcessing
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Polyline, Object as FabricObject } from "fabric";

interface UseFloorPlanBatchProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}

/**
 * Hook that handles batch processing of floor plan rendering operations
 */
export const useFloorPlanBatchProcessing = ({
  fabricCanvasRef,
  gridLayerRef
}: UseFloorPlanBatchProcessingProps) => {
  // Refs to manage batched operations
  const batchedDrawOpsRef = useRef<Polyline[]>([]);
  const animFrameRef = useRef<number | null>(null);

  /**
   * Process batched drawing operations in a single render cycle
   */
  const processBatchedDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || batchedDrawOpsRef.current.length === 0) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Process all batched polylines at once
    canvas.renderOnAddRemove = false;
    
    // Add all polylines in one batch
    batchedDrawOpsRef.current.forEach(polyline => {
      canvas.add(polyline);
    });
    
    // Ensure grid stays in background
    gridLayerRef.current.forEach(gridObj => {
      canvas.sendObjectToBack(gridObj);
    });
    
    canvas.renderOnAddRemove = true;
    canvas.requestRenderAll();
    
    // Clear the batch
    batchedDrawOpsRef.current = [];
    animFrameRef.current = null;
  }, [fabricCanvasRef, gridLayerRef]);

  return {
    batchedDrawOpsRef,
    animFrameRef,
    processBatchedDrawing
  };
};
