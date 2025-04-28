
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';

export const useGrid = (options?: {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
} | number) => {
  // Handle both new interface and backward compatibility with number parameter
  const gridSize = typeof options === 'number' 
    ? options 
    : options?.initialGridSize ?? GRID_CONSTANTS.DEFAULT_GRID_SIZE;
  
  const isVisible = typeof options !== 'number' 
    ? options?.initialVisible ?? true 
    : true;

  const snapToGrid = useCallback((point: Point): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize]);

  const calculateGridDimensions = useCallback((width: number, height: number) => {
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    
    return {
      cols,
      rows,
      totalLines: cols + rows,
      width,
      height
    };
  }, [gridSize]);

  const createGrid = useCallback((canvas: FabricCanvas): FabricObject[] => {
    if (!canvas) return [];
    
    const gridObjects: FabricObject[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += GRID_CONSTANTS.SMALL.SIZE) {
      const isLargeLine = x % GRID_CONSTANTS.LARGE.SIZE === 0;
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: isLargeLine,
        visible: isVisible
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += GRID_CONSTANTS.SMALL.SIZE) {
      const isLargeLine = y % GRID_CONSTANTS.LARGE.SIZE === 0;
      const line = new Line([0, y, canvasWidth, y], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: isLargeLine,
        visible: isVisible
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send all grid objects to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    canvas.renderAll();
    return gridObjects;
  }, [gridSize, isVisible]);

  const toggleGridVisibility = useCallback((visible?: boolean) => {
    if (!options || typeof options === 'number') return;
    
    const canvas = options.fabricCanvasRef?.current;
    const gridLayer = options.gridLayerRef?.current;
    
    if (!canvas || !gridLayer) return;
    
    const newVisibility = visible !== undefined ? visible : !isVisible;
    
    gridLayer.forEach(obj => {
      (obj as any).visible = newVisibility;
    });
    
    canvas.renderAll();
    
    return newVisibility;
  }, [isVisible, options]);

  return {
    snapToGrid,
    calculateGridDimensions,
    gridSize,
    createGrid,
    toggleGridVisibility
  };
};
