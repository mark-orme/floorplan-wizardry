
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  SMALL_GRID_SIZE, 
  LARGE_GRID_SIZE,
  SMALL_GRID_COLOR, 
  LARGE_GRID_COLOR,
  SMALL_GRID_WIDTH, 
  LARGE_GRID_WIDTH
} from '@/constants/gridConstants';

export type GridLine = fabric.Line;

interface UseGridProps {
  fabricCanvasRef?: React.MutableRefObject<fabric.Canvas | null>;
  gridLayerRef?: React.MutableRefObject<fabric.Object[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = (props?: UseGridProps) => {
  // Create grid function
  const createGrid = useCallback((canvas: fabric.Canvas, gridSize: number = SMALL_GRID_SIZE): fabric.Object[] => {
    if (!canvas) return [];
    
    const gridObjects: fabric.Object[] = [];
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % LARGE_GRID_SIZE === 0;
      const line = new fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % LARGE_GRID_SIZE === 0;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    return gridObjects;
  }, []);
  
  // Additional grid utility functions
  const toggleGridVisibility = useCallback((gridObjects: fabric.Object[], visible: boolean) => {
    gridObjects.forEach(obj => {
      (obj as any).visible = visible;
    });
  }, []);
  
  const snapToGrid = useCallback((value: number, gridSize: number = SMALL_GRID_SIZE): number => {
    return Math.round(value / gridSize) * gridSize;
  }, []);
  
  return {
    createGrid,
    toggleGridVisibility,
    snapToGrid,
    gridSize: SMALL_GRID_SIZE
  };
};
