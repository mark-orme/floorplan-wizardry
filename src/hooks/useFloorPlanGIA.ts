/**
 * Hook for calculating Gross Internal Area (GIA) for floor plans
 * @module useFloorPlanGIA
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { FloorPlan } from '@/types/floorPlanTypes';
import { Point } from '@/types/core/Point';
import { calculateGIA } from '@/utils/geometry';

interface UseFloorPlanGIAProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

// Define a type for coordinates to avoid type errors
interface RoomCoordinates {
  x: number;
  y: number;
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
      // Use type assertion to access custom property on FabricObject
      const rooms = fabricCanvasRef.current.getObjects().filter(
        obj => obj.type === 'polyline' && 
        (obj as unknown as { objectType?: string }).objectType === 'room'
      );
      
      // OPTIMIZATION: Limit processing to max 50 rooms for performance
      const roomsToProcess = rooms.length > 50 ? rooms.slice(0, 50) : rooms;
      
      roomsToProcess.forEach(room => {
        const polyline = room as FabricPolyline;
        const coords = polyline.points || [];
        
        if (coords.length > 2) {
          // Convert coordinates from pixels to meters
          const points = coords.map(p => ({ 
            x: p.x / PIXELS_PER_METER, 
            y: p.y / PIXELS_PER_METER 
          }));
          
          // Calculate GIA for this room
          const roomGIA = calculateGIA(points as Point[]);
          totalGIA += roomGIA;
          
          // For debugging
          if (process.env.NODE_ENV === 'development') {
            console.log(`Room calculated: ${roomGIA.toFixed(2)}m² (total: ${totalGIA.toFixed(2)}m²)`);
          }
        }
      });
      
      // Update the GIA state with the calculated total
      setGia(totalGIA);
    }
  }, [fabricCanvasRef, setGia]);

  return { recalculateGIA };
};
