
import { useRef, useEffect, useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { addCanvasEvent, removeCanvasEvent } from '@/utils/canvas/eventHandlers';

interface UseGridManagementOptions {
  initialVisible?: boolean;
  gridSize?: number;
  gridColor?: string;
  largeGridSize?: number;
  largeGridColor?: string;
}

export function useGridManagement(canvas: Canvas | null, options: UseGridManagementOptions = {}) {
  const {
    initialVisible = true,
    gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE,
    gridColor = GRID_CONSTANTS.SMALL_GRID_COLOR,
    largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE,
    largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR
  } = options;
  
  const [isVisible, setIsVisible] = useState(initialVisible);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid on canvas initialization
  useEffect(() => {
    if (!canvas) return;
    
    const createGrid = () => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const objects: FabricObject[] = [];
      
      // Clean up existing grid
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Create vertical grid lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        const isLargeLine = x % largeGridSize === 0;
        const line = new fabric.Line([x, 0, x, canvasHeight], {
          stroke: isLargeLine ? largeGridColor : gridColor,
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible: isVisible
        } as any);
        
        canvas.add(line);
        objects.push(line);
      }
      
      // Create horizontal grid lines
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        const isLargeLine = y % largeGridSize === 0;
        const line = new fabric.Line([0, y, canvasWidth, y], {
          stroke: isLargeLine ? largeGridColor : gridColor,
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible: isVisible
        } as any);
        
        canvas.add(line);
        objects.push(line);
      }
      
      // Send grid to back
      objects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      gridObjectsRef.current = objects;
      canvas.requestRenderAll();
    };
    
    // Create grid on startup
    createGrid();
    
    // Handle canvas resize
    const handleResize = () => {
      createGrid();
    };
    
    // Add event listener safely
    addCanvasEvent(canvas, 'resize', handleResize);
    
    // Clean up
    return () => {
      // Clean up existing grid
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Remove event listener safely
      removeCanvasEvent(canvas, 'resize', handleResize);
    };
  }, [canvas, gridSize, gridColor, largeGridSize, largeGridColor, isVisible]);
  
  // Toggle grid visibility
  const toggleGrid = () => {
    setIsVisible(prev => !prev);
    
    gridObjectsRef.current.forEach(obj => {
      obj.set('visible', !isVisible);
    });
    
    if (canvas) {
      canvas.requestRenderAll();
    }
  };
  
  // Show grid
  const showGrid = () => {
    if (isVisible) return;
    
    setIsVisible(true);
    
    gridObjectsRef.current.forEach(obj => {
      obj.set('visible', true);
    });
    
    if (canvas) {
      canvas.requestRenderAll();
    }
  };
  
  // Hide grid
  const hideGrid = () => {
    if (!isVisible) return;
    
    setIsVisible(false);
    
    gridObjectsRef.current.forEach(obj => {
      obj.set('visible', false);
    });
    
    if (canvas) {
      canvas.requestRenderAll();
    }
  };
  
  return {
    isVisible,
    toggleGrid,
    showGrid,
    hideGrid,
    gridObjects: gridObjectsRef.current
  };
}
