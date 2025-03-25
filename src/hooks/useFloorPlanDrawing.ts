
/**
 * Custom hook for drawing floor plans on the canvas
 * @module useFloorPlanDrawing
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Polyline } from "fabric";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { FloorPlan } from "@/utils/drawingTypes";

interface UseFloorPlanDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  createGrid: (canvas: FabricCanvas) => any[];
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
  const batchedDrawOpsRef = useRef<Polyline[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastDrawnFloorRef = useRef<number | null>(null);

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
    
    // OPTIMIZATION: Batch polyline creation
    const totalStrokes = currentPlan.strokes.length;
    
    // Only log if we actually have strokes to draw
    if (totalStrokes > 0) {
      console.log(`Drawing ${totalStrokes} strokes for floor plan`);
    }
    
    // OPTIMIZATION: Use chunk processing for large floor plans
    const CHUNK_SIZE = 20; // Process 20 strokes at a time - reduced for better performance
    
    const processStrokeChunk = (startIdx: number) => {
      const endIdx = Math.min(startIdx + CHUNK_SIZE, totalStrokes);
      
      for (let i = startIdx; i < endIdx; i++) {
        const stroke = currentPlan.strokes[i];
        
        const polyline = new Polyline(
          stroke.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
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
      if (endIdx < totalStrokes) {
        setTimeout(() => processStrokeChunk(endIdx), 10); // Reduced delay for faster processing
      } else {
        // All chunks processed
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.renderOnAddRemove = true;
          fabricCanvasRef.current.requestRenderAll();
        }
        if (floorChangeInProgressRef) {
          floorChangeInProgressRef.current = false;
        }
      }
    };
    
    // Start processing the first chunk
    if (totalStrokes > 0) {
      if (floorChangeInProgressRef) {
        floorChangeInProgressRef.current = true;
      }
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
        if (floorChangeInProgressRef) {
          floorChangeInProgressRef.current = false;
        }
      }
    } else {
      // No strokes to draw
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.renderOnAddRemove = true;
        fabricCanvasRef.current.requestRenderAll();
      }
      if (floorChangeInProgressRef) {
        floorChangeInProgressRef.current = false;
      }
    }
  }, [fabricCanvasRef, gridLayerRef, createGrid]);

  return {
    drawFloorPlan,
    processBatchedDrawing,
    lastDrawnFloorRef,
    floorChangeInProgressRef
  };
};
