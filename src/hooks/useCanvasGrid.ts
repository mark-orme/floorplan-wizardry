
import { useState, useCallback, useEffect } from 'react';
import { Canvas, Object as FabricObject } from "fabric";
import { ExtendedFabricCanvas } from '@/types/fabric-unified';
import { ensureGridVisibility, setGridVisibility } from '@/utils/grid/gridVisibility';

interface UseCanvasGridProps {
  canvas: Canvas | ExtendedFabricCanvas | null;
  gridSize?: number;
  initialVisible?: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
}

export const useCanvasGrid = ({
  canvas,
  gridSize: initialGridSize = 20,
  initialVisible = true,
  onGridCreated
}: UseCanvasGridProps) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [visible, setVisible] = useState(initialVisible);
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create grid function
  const createGrid = useCallback((targetCanvas: Canvas | ExtendedFabricCanvas = canvas as Canvas): FabricObject[] => {
    if (!targetCanvas) return [];
    
    setIsCreating(true);
    setError(null);
    
    try {
      // Remove existing grid objects
      const existingGridObjects = targetCanvas.getObjects().filter(obj => 
        (obj as any).isGrid === true
      );
      
      if (existingGridObjects.length > 0) {
        targetCanvas.remove(...existingGridObjects);
      }
      
      // Create new grid objects (simplified for this example)
      const newGridObjects: FabricObject[] = [];
      
      // Create horizontal grid lines
      for (let y = 0; y <= 600; y += gridSize) {
        const line = new fabric.Line([0, y, 800, y], {
          stroke: y % 100 === 0 ? '#cccccc' : '#e5e5e5',
          strokeWidth: y % 100 === 0 ? 1 : 0.5,
          selectable: false,
          evented: false
        });
        
        (line as any).isGrid = true;
        (line as any).visible = visible;
        
        targetCanvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create vertical grid lines
      for (let x = 0; x <= 800; x += gridSize) {
        const line = new fabric.Line([x, 0, x, 600], {
          stroke: x % 100 === 0 ? '#cccccc' : '#e5e5e5',
          strokeWidth: x % 100 === 0 ? 1 : 0.5,
          selectable: false,
          evented: false
        });
        
        (line as any).isGrid = true;
        (line as any).visible = visible;
        
        targetCanvas.add(line);
        newGridObjects.push(line);
      }
      
      // Update state with new objects
      setGridObjects(newGridObjects);
      
      // Call onGridCreated callback
      if (onGridCreated) {
        onGridCreated(newGridObjects);
      }
      
      targetCanvas.requestRenderAll();
      return newGridObjects;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error creating grid');
      console.error('Error creating grid:', error);
      setError(error);
      return [];
    } finally {
      setIsCreating(false);
    }
  }, [canvas, gridSize, visible, onGridCreated]);

  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    if (!canvas) return false;
    
    const newVisible = !visible;
    setVisible(newVisible);
    
    return ensureGridVisibility(canvas, newVisible);
  }, [canvas, visible]);
  
  // Toggle grid visibility shorthand
  const toggleGrid = useCallback(() => {
    toggleGridVisibility();
  }, [toggleGridVisibility]);
  
  // Resize grid
  const resizeGrid = useCallback(() => {
    return createGrid();
  }, [createGrid]);

  // Update grid visibility when visibility state changes
  useEffect(() => {
    if (canvas && gridObjects.length > 0) {
      ensureGridVisibility(canvas, visible);
    }
  }, [canvas, visible, gridObjects]);
  
  // Create grid on canvas ready
  useEffect(() => {
    if (canvas && gridObjects.length === 0) {
      createGrid();
    }
  }, [canvas, gridObjects.length, createGrid]);
  
  return {
    gridObjects,
    isGridVisible: visible,
    isCreating,
    error,
    createGrid,
    toggleGridVisibility,
    toggleGrid,
    resizeGrid,
    setIsVisible: setVisible,
    setIsEnabled: setVisible,
    gridSize,
    setGridSize,
    visible,
    setVisible,
  };
};
