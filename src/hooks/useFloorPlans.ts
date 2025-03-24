
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

  // Auto-save floor plans when they change
  useEffect(() => {
    if (isLoading || floorPlans.length === 0) return;
    
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveFloorPlans(floorPlans);
        saveTimeoutRef.current = null;
      } catch (error) {
        console.error("Error saving floor plans:", error);
      }
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [floorPlans, isLoading]);

  // Draw the selected floor plan on the canvas
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
    
    fabricCanvasRef.current.renderOnAddRemove = false;
    
    gridLayerRef.current.forEach(gridObj => {
      fabricCanvasRef.current!.sendObjectToBack(gridObj);
    });
    
    console.log(`Drawing ${currentPlan.strokes.length} strokes for floor plan`);
    currentPlan.strokes.forEach(stroke => {
      const polyline = new Polyline(
        stroke.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
        {
          stroke: '#000000',
          strokeWidth: 2,
          fill: 'transparent',
          objectType: 'line'
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
    });
    
    fabricCanvasRef.current.renderOnAddRemove = true;
    fabricCanvasRef.current.renderAll();
  }, [floorPlans, currentFloor, fabricCanvasRef, gridLayerRef, createGrid]);

  // Update canvas when floor changes
  useEffect(() => {
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    console.log("Floor changed, updating canvas");
    clearDrawings();
    drawFloorPlan();
    recalculateGIA();
  }, [currentFloor, floorPlans, isLoading, fabricCanvasRef, clearDrawings, drawFloorPlan]);

  // Calculate Gross Internal Area (GIA)
  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    let totalGIA = 0;
    const rooms = fabricCanvasRef.current.getObjects().filter(
      obj => obj.type === 'polyline' && (obj as any).objectType === 'room'
    );
    
    rooms.forEach(room => {
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
  }, [fabricCanvasRef, setGia]);

  // Handle floor plan actions
  const handleAddFloor = useCallback(() => {
    setFloorPlans(prev => [
      ...prev, 
      { 
        strokes: [], 
        label: `Floor ${prev.length + 1}`,
        paperSize: "infinite" as PaperSize  // Explicitly type as PaperSize
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
