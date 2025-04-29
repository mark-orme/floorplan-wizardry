
import { useCallback, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { validateGrid } from '@/utils/grid/gridRenderers';
import { toast } from 'sonner';

interface UseGridCreationProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  enabled?: boolean;
}

export const useGridCreation = ({
  canvas,
  gridSize = 20,
  visible = true,
  enabled = true
}: UseGridCreationProps) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const gridObjectsRef = useRef<fabric.Object[]>([]);
  
  // Create and add grid to canvas
  const createGrid = useCallback(() => {
    if (!canvas || !isEnabled) {
      return [];
    }
    
    // Remove existing grid
    gridObjectsRef.current.forEach(obj => {
      canvas.remove(obj);
    });
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newGridObjects: fabric.Object[] = [];
    
    try {
      // Create vertical grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          visible: isVisible
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create horizontal grid lines
      for (let y = 0; y <= height; y += gridSize) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          visible: isVisible
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Send grid to back
      newGridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      gridObjectsRef.current = newGridObjects;
      canvas.renderAll();
      
      return newGridObjects;
    } catch (error) {
      toast.error('Failed to create grid');
      console.error('Error creating grid:', error);
      return [];
    }
  }, [canvas, gridSize, isVisible, isEnabled]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    gridObjectsRef.current.forEach(obj => {
      if (typeof obj.set === 'function') {
        obj.set({ visible: newVisibility });
      }
    });
    
    if (canvas) {
      canvas.renderAll();
    }
    
    return newVisibility;
  }, [isVisible, canvas]);
  
  // Handle canvas resize
  const resizeGrid = useCallback(() => {
    if (validateGrid(gridObjectsRef.current)) {
      // Clear existing grid
      gridObjectsRef.current.forEach(obj => {
        if (canvas) {
          canvas.remove(obj);
        }
      });
      gridObjectsRef.current = [];
      
      // Create new grid with updated dimensions
      return createGrid();
    }
    return [];
  }, [canvas, createGrid]);
  
  return {
    gridObjects: gridObjectsRef.current,
    isGridVisible: isVisible,
    createGrid,
    toggleGridVisibility,
    resizeGrid,
    setIsEnabled,
    setIsVisible
  };
};
