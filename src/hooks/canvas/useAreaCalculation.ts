
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { calculatePolygonArea } from '@/utils/computeUtils';
import { toast } from 'sonner';

export const useAreaCalculation = (canvas: FabricCanvas | null) => {
  const calculateArea = useCallback(async () => {
    if (!canvas) return { areaM2: 0 };
    
    try {
      const polygons = canvas.getObjects().filter(obj => obj.type === 'polygon');
      
      if (polygons.length === 0) {
        toast.info("No polygon areas to calculate");
        return { areaM2: 0 };
      }
      
      let totalArea = 0;
      for (const polygon of polygons) {
        const points = (polygon as any).points || [];
        const area = await calculatePolygonArea(points);
        totalArea += area;
      }
      
      const areaM2 = totalArea / 10000;
      toast.success(`Area calculated: ${areaM2.toFixed(2)} m²`);
      return { areaM2 };
    } catch (error) {
      console.error("Error calculating area:", error);
      toast.error("Error calculating area");
      return { areaM2: 0 };
    }
  }, [canvas]);

  return { calculateArea };
};
