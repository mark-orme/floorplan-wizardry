
import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const usePointerPosition = (canvas: FabricCanvas | null) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvas) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Get canvas element and its bounding box
      const canvasElement = canvas.getElement();
      if (!canvasElement) return;
      
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Calculate position relative to viewport
      setPosition({
        x: event.clientX,
        y: event.clientY
      });
    };
    
    // Add mouse move event listener to document
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvas]);

  return { position };
};
