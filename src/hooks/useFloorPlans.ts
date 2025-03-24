
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Polyline } from "fabric";
import { toast } from "sonner";
import { 
  FloorPlan, 
  loadFloorPlans, 
  saveFloorPlans, 
  PIXELS_PER_METER,
  calculateGIA,
  PaperSize
} from "@/utils/drawing";

interface UseFloorPlansProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  isLoading: boolean;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  clearDrawings: () => void;
  createGrid: (canvas: FabricCanvas) => any[];
}

export const useFloorPlans = ({
  fabricCanvasRef,
  gridLayerRef,
  floorPlans,
  currentFloor,
  isLoading,
  setGia,
  setFloorPlans,
  clearDrawings,
  createGrid
}: UseFloorPlansProps) => {
  const saveTimeoutRef = useRef<number | null>(null);
  const batchedDrawOpsRef = useRef<Polyline[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Auto-save floor plans when they change with debounce
  useEffect(() => {
    if (isLoading || floorPlans.length === 0) return;
    
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    
    // OPTIMIZATION: Increased debounce timeout for better performance
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveFloorPlans(floorPlans);
        saveTimeoutRef.current = null;
      } catch (error) {
        console.error("Error saving floor plans:", error);
      }
    }, 2000); // Increased from 1000ms to 2000ms
    
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [floorPlans, isLoading]);

  // OPTIMIZATION: Batched drawing function for better performance
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

  // Draw the selected floor plan on the canvas with optimizations
  const drawFloorPlan = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot draw floor plan: fabric canvas is null");
      return;
    }
    
    const currentPlan = floorPlans[currentFloor];
    if (!currentPlan) {
      console.error("Cannot draw floor plan: no plan data for current floor");
      return;
    }
    
    if (gridLayerRef.current.length === 0) {
      console.log("No grid found, creating new grid");
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
      fabricCanvasRef.current!.sendObjectToBack(gridObj);
    });
    
    // OPTIMIZATION: Batch polyline creation
    const totalStrokes = currentPlan.strokes.length;
    console.log(`Drawing ${totalStrokes} strokes for floor plan`);
    
    // OPTIMIZATION: Use chunk processing for large floor plans
    const CHUNK_SIZE = 50; // Process 50 strokes at a time
    
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
            objectCaching: true, // OPTIMIZATION: Enable caching
            strokeUniform: false, // OPTIMIZATION: Disable uniform stroke
            perPixelTargetFind: false, // OPTIMIZATION: Disable per-pixel target find
            selectable: false, // OPTIMIZATION: Make non-selectable when just displaying
            evented: false // OPTIMIZATION: Disable events when just displaying
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
        
        fabricCanvasRef.current!.add(polyline);
      }
      
      // If there are more chunks to process, schedule next chunk
      if (endIdx < totalStrokes) {
        setTimeout(() => processStrokeChunk(endIdx), 0);
      } else {
        // All chunks processed
        fabricCanvasRef.current!.renderOnAddRemove = true;
        fabricCanvasRef.current!.requestRenderAll();
      }
    };
    
    // Start processing the first chunk
    if (totalStrokes > CHUNK_SIZE) {
      // For large plans, use chunked processing
      processStrokeChunk(0);
    } else {
      // For small plans, process all at once
      processStrokeChunk(0);
      fabricCanvasRef.current.renderOnAddRemove = true;
      fabricCanvasRef.current.requestRenderAll();
    }
  }, [floorPlans, currentFloor, fabricCanvasRef, gridLayerRef, createGrid]);

  // Update canvas when floor changes with optimization
  useEffect(() => {
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    // OPTIMIZATION: Use requestIdleCallback for floor transitions
    const floorChangeHandler = () => {
      console.log("Floor changed, updating canvas");
      clearDrawings();
      drawFloorPlan();
      
      // OPTIMIZATION: Delay GIA calculation after drawing is complete
      setTimeout(recalculateGIA, 100);
    };
    
    // Use requestIdleCallback or setTimeout as fallback
    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(floorChangeHandler, { timeout: 200 });
    } else {
      setTimeout(floorChangeHandler, 50);
    }
  }, [currentFloor, floorPlans, isLoading, fabricCanvasRef, clearDrawings, drawFloorPlan]);

  // Calculate Gross Internal Area (GIA) with optimized performance
  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // OPTIMIZATION: Run calculation in next animation frame for better UI responsiveness
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        calculateGIANow();
      });
    } else {
      calculateGIANow();
    }
    
    function calculateGIANow() {
      let totalGIA = 0;
      const rooms = fabricCanvasRef.current!.getObjects().filter(
        obj => obj.type === 'polyline' && (obj as any).objectType === 'room'
      );
      
      // OPTIMIZATION: Limit processing to max 100 rooms for performance
      const roomsToProcess = rooms.length > 100 ? rooms.slice(0, 100) : rooms;
      
      roomsToProcess.forEach(room => {
        const polyline = room as Polyline;
        const coords = polyline.points || [];
        if (coords.length > 2) {
          const points = coords.map(p => ({ 
            x: p.x / PIXELS_PER_METER, 
            y: p.y / PIXELS_PER_METER 
          }));
          totalGIA += calculateGIA(points);
        }
      });
      
      setGia(totalGIA);
    }
  }, [fabricCanvasRef, setGia]);

  // Handle floor plan actions
  const handleAddFloor = useCallback(() => {
    setFloorPlans(prev => [
      ...prev, 
      { 
        strokes: [], 
        label: `Floor ${prev.length + 1}`,
        paperSize: "infinite" as PaperSize  // Explicitly cast as PaperSize
      }
    ]);
    toast.success(`New floor plan added: Floor ${floorPlans.length + 1}`);
  }, [floorPlans.length, setFloorPlans]);

  const handleSelectFloor = useCallback((index: number) => {
    toast.info(`Switched to ${floorPlans[index]?.label || 'Unknown floor'}`);
  }, [floorPlans]);

  return {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData: loadFloorPlans
  };
};
