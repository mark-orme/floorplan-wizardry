
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { GridLine } from '@/utils/grid/gridTypes';

/**
 * Hook for working with canvas grids
 */
export const useGrid = () => {
  const createGridCallback = useCallback((canvas: fabric.Canvas, gridSize: number = 50): GridLine[] => {
    const gridObjects: GridLine[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      const line = new fabric.Line([x, 0, x, canvasHeight], {
        stroke: '#e0e0e0',
        opacity: 0.5,
        selectable: false,
        evented: false,
        gridObject: true,
        gridType: 'vertical',
      }) as GridLine;
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      const line = new fabric.Line([0, y, canvasWidth, y], {
        stroke: '#e0e0e0',
        opacity: 0.5,
        selectable: false,
        evented: false,
        gridObject: true,
        gridType: 'horizontal',
      }) as GridLine;
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  }, []);
  
  return {
    createGrid: createGridCallback
  };
};
