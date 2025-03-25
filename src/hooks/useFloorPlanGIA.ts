
/**
 * Custom hook for calculating Gross Internal Area (GIA)
 * @module useFloorPlanGIA
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline } from "fabric";
import { PIXELS_PER_METER, calculateGIA } from "@/utils/drawing";

interface UseFloorPlanGIAProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook that handles GIA calculations for floor plans
 */
export const useFloorPlanGIA = ({
  fabricCanvasRef,
  setGia
}: UseFloorPlanGIAProps) => {
  /**
   * Calculate and update the Gross Internal Area (GIA) with optimized performance
   */
  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Calculate in next animation frame for better UI responsiveness
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        calculateGIANow();
      });
    } else {
      calculateGIANow();
    }
    
    function calculateGIANow() {
      if (!fabricCanvasRef.current) return;
      
      let totalGIA = 0;
      const rooms = fabricCanvasRef.current.getObjects().filter(
        obj => obj.type === 'polyline' && (obj as any).objectType === 'room'
      );
      
      // OPTIMIZATION: Limit processing to max 50 rooms for performance
      const roomsToProcess = rooms.length > 50 ? rooms.slice(0, 50) : rooms;
      
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

  return { recalculateGIA };
};
