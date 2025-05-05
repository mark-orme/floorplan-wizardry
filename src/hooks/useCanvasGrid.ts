
import { useCallback, useState, useEffect } from 'react';
import { Canvas, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/types/fabric-unified';
import { FixMe } from '@/types/typesMap';

// Props for useCanvasGrid hook
export interface UseCanvasGridProps {
  /** Canvas reference */
  fabricCanvas?: Canvas | null;
}

// Result type for useCanvasGrid hook
export interface UseCanvasGridResult {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  createGrid: (canvas: Canvas) => fabric.Object[];
  updateGrid: (canvas: Canvas, size: number) => void;
  removeGrid: (canvas: Canvas) => void;
}

/**
 * Hook for managing canvas grid
 * @param props - Hook props
 * @returns Grid management methods and state
 */
export const useCanvasGrid = ({ fabricCanvas }: UseCanvasGridProps = {}): UseCanvasGridResult => {
  const [visible, setVisible] = useState(true);
  
  // Create grid lines
  const createGrid = useCallback((canvas: Canvas): fabric.Object[] => {
    if (!canvas) return [];
    
    const gridObjects: fabric.Object[] = [];
    const width = canvas.getWidth() || 800;
    const height = canvas.getHeight() || 600;
    
    // Create small grid
    for (let i = 0; i < width / GRID_CONSTANTS.SMALL_GRID_SIZE; i++) {
      const x = i * GRID_CONSTANTS.SMALL_GRID_SIZE;
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false
      }) as unknown as FixMe<fabric.Object>;
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).excludeFromExport = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal small grid
    for (let i = 0; i < height / GRID_CONSTANTS.SMALL_GRID_SIZE; i++) {
      const y = i * GRID_CONSTANTS.SMALL_GRID_SIZE;
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false
      }) as unknown as FixMe<fabric.Object>;
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).excludeFromExport = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical large grid
    for (let i = 0; i < width / GRID_CONSTANTS.LARGE_GRID_SIZE; i++) {
      const x = i * GRID_CONSTANTS.LARGE_GRID_SIZE;
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false
      }) as unknown as FixMe<fabric.Object>;
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).isLargeGrid = true;
      (line as any).excludeFromExport = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal large grid
    for (let i = 0; i < height / GRID_CONSTANTS.LARGE_GRID_SIZE; i++) {
      const y = i * GRID_CONSTANTS.LARGE_GRID_SIZE;
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false
      }) as unknown as FixMe<fabric.Object>;
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).isLargeGrid = true;
      (line as any).excludeFromExport = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    return gridObjects;
  }, []);
  
  // Update grid with new size
  const updateGrid = useCallback((canvas: Canvas, size: number) => {
    if (!canvas) return;
    
    // Remove existing grid
    removeGrid(canvas);
    
    // Create new grid
    createGrid(canvas);
  }, [createGrid]);
  
  // Remove grid
  const removeGrid = useCallback((canvas: Canvas) => {
    if (!canvas) return;
    
    const gridObjects = canvas.getObjects().filter(obj => (obj as any).isGrid);
    gridObjects.forEach(obj => canvas.remove(obj));
    
    canvas.renderAll();
  }, []);
  
  // Update grid visibility when visible state changes
  useEffect(() => {
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      objects.filter(obj => (obj as any).isGrid).forEach(obj => {
        obj.set({ visible });
      });
      fabricCanvas.renderAll();
    }
  }, [visible, fabricCanvas]);
  
  return {
    visible,
    setVisible,
    createGrid,
    updateGrid,
    removeGrid
  };
};

export default useCanvasGrid;
