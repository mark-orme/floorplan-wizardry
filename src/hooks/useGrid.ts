
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';

export const useGrid = () => {
  const createGrid = useCallback((canvas: FabricCanvas, gridSize: number = 50) => {
    if (!canvas) return [];
    
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const lines = [];
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e0e0e0',
        selectable: false,
        strokeWidth: 1,
        opacity: 0.5,
        evented: false,
        objectCaching: false
      });
      lines.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        selectable: false,
        strokeWidth: 1,
        opacity: 0.5,
        evented: false,
        objectCaching: false
      });
      lines.push(line);
    }
    
    return lines;
  }, []);
  
  return { createGrid };
};
