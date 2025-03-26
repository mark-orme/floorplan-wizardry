
import { useState, useEffect } from 'react';
import { CanvasDimensions } from '@/types/drawingTypes';

export const useCanvasDimensions = (): CanvasDimensions => {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 800,
    height: 600
  });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
