
import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';

export const useGridManagement = (canvasRef: React.MutableRefObject<FabricCanvas | null>) => {
  const gridLinesRef = useRef<FabricObject[]>([]);

  // Create grid of lines
  const createGrid = useCallback((gridSize = 20, color = '#e0e0e0') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear any existing grid lines
    removeGrid();
    
    const width = canvas.getWidth() || 800;
    const height = canvas.getHeight() || 600;
    
    // Create vertical lines
    for (let i = gridSize; i < width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: color,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        strokeDashArray: [1, 3],
        objectType: 'grid'
      });
      
      gridLinesRef.current.push(line);
      canvas.add(line as unknown as FabricObject);
    }
    
    // Create horizontal lines
    for (let i = gridSize; i < height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: color,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        strokeDashArray: [1, 3],
        objectType: 'grid'
      });
      
      gridLinesRef.current.push(line);
      canvas.add(line as unknown as FabricObject);
    }
    
    // Send grid to back
    gridLinesRef.current.forEach(line => {
      canvas.sendToBack(line);
    });
    
    canvas.requestRenderAll();
  }, [canvasRef]);
  
  // Remove grid lines
  const removeGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    gridLinesRef.current.forEach(line => {
      canvas.remove(line);
    });
    
    gridLinesRef.current = [];
    canvas.requestRenderAll();
  }, [canvasRef]);
  
  // Toggle grid visibility
  const toggleGrid = useCallback((visible: boolean, gridSize = 20, color = '#e0e0e0') => {
    if (visible) {
      createGrid(gridSize, color);
    } else {
      removeGrid();
    }
  }, [createGrid, removeGrid]);
  
  return {
    createGrid,
    removeGrid,
    toggleGrid
  };
};
