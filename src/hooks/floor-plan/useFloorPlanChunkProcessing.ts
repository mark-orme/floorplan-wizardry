
/**
 * Custom hook for optimized chunk processing of floor plan strokes
 * @module useFloorPlanChunkProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline, Object as FabricObject } from "fabric";
import { PIXELS_PER_METER } from "@/utils/drawing";

interface UseFloorPlanChunkProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  floorChangeInProgressRef: React.MutableRefObject<boolean>;
}

/**
 * Hook that handles chunk processing for large floor plans
 */
export const useFloorPlanChunkProcessing = ({
  fabricCanvasRef,
  gridLayerRef,
  floorChangeInProgressRef
}: UseFloorPlanChunkProcessingProps) => {
  /**
   * Process floor plan strokes in chunks for better performance
   */
  const processFloorPlanInChunks = useCallback((
    strokes: Array<Array<{x: number, y: number}>>,
    totalStrokes: number
  ) => {
    if (!fabricCanvasRef.current) return;
    
    // OPTIMIZATION: Use chunk processing for large floor plans
    const CHUNK_SIZE = 20; // Process 20 strokes at a time - reduced for better performance
    
    const processStrokeChunk = (startIndex: number) => {
      if (!fabricCanvasRef.current) return;
      
      const endIndex = Math.min(startIndex + CHUNK_SIZE, totalStrokes);
      
      for (let i = startIndex; i < endIndex; i++) {
        const stroke = strokes[i];
        
        const polyline = new Polyline(
          stroke.map(point => ({ x: point.x * PIXELS_PER_METER, y: point.y * PIXELS_PER_METER })),
          {
            stroke: '#000000',
            strokeWidth: 2,
            fill: 'transparent',
            objectType: 'line',
            objectCaching: true,
            strokeUniform: false,
            perPixelTargetFind: false,
            selectable: false,
            evented: false
          }
        );
        
        if (stroke.length > 2 && 
            Math.abs(stroke[0].x - stroke[stroke.length-1].x) < 0.01 && 
            Math.abs(stroke[0].y - stroke[stroke.length-1].y) < 0.01) {
          polyline.set({
            fill: 'rgba(0, 0, 255, 0.1)',
            objectType: 'room'
          });
        }
        
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.add(polyline);
        }
      }
      
      // If there are more chunks to process, schedule next chunk
      if (endIndex < totalStrokes) {
        setTimeout(() => processStrokeChunk(endIndex), 10); // Reduced delay for faster processing
      } else {
        // All chunks processed
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.renderOnAddRemove = true;
          fabricCanvasRef.current.requestRenderAll();
        }
        floorChangeInProgressRef.current = false;
      }
    };
    
    // Start processing the first chunk
    if (totalStrokes > 0) {
      floorChangeInProgressRef.current = true;
      if (totalStrokes > CHUNK_SIZE) {
        // For large plans, use chunked processing
        processStrokeChunk(0);
      } else {
        // For small plans, process all at once
        processStrokeChunk(0);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.renderOnAddRemove = true;
          fabricCanvasRef.current.requestRenderAll();
        }
        floorChangeInProgressRef.current = false;
      }
    } else {
      // No strokes to draw
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.renderOnAddRemove = true;
        fabricCanvasRef.current.requestRenderAll();
      }
      floorChangeInProgressRef.current = false;
    }
  }, [fabricCanvasRef, floorChangeInProgressRef]);

  return {
    processFloorPlanInChunks
  };
};
