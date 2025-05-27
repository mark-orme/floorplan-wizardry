
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useAreaCalculation = (canvas: FabricCanvas | null) => {
  
  const calculateArea = useCallback(async (): Promise<{ areaM2: number }> => {
    if (!canvas) return { areaM2: 0 };
    
    // Simple area calculation based on canvas objects
    const objects = canvas.getObjects();
    let totalArea = 0;
    
    objects.forEach(obj => {
      if (obj.width && obj.height) {
        totalArea += obj.width * obj.height;
      }
    });
    
    // Convert pixels to square meters (simplified)
    const areaM2 = totalArea / (100 * 100); // Assuming 100 pixels = 1 meter
    
    return { areaM2 };
  }, [canvas]);
  
  return {
    calculateArea
  };
};
