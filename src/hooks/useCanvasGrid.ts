
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas, Line } from 'fabric';

interface UseCanvasGridOptions {
  canvas: Canvas | null;
  initialGridSize?: number;
  initialVisible?: boolean;
}

// Grid constants
const GRID_CONSTANTS = {
  SMALL_GRID: 20,
  LARGE_GRID: 100,
  GRID_COLOR: '#cccccc',
  LARGE_GRID_COLOR: '#a0a0a0',
  SMALL_GRID_COLOR: '#e0e0e0',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  PIXELS_PER_METER: 100
};

export const useCanvasGrid = ({
  canvas,
  initialGridSize = 20,
  initialVisible = true
}: UseCanvasGridOptions) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [isVisible, setIsVisible] = useState(initialVisible);
  const gridLinesRef = useRef<Line[]>([]);
  
  // Create grid lines
  const createGridLines = useCallback(() => {
    if (!canvas) return [];
    
    const width = canvas.getWidth ? canvas.getWidth() : 800;
    const height = canvas.getHeight ? canvas.getHeight() : 600;
    
    const gridLines: Line[] = [];
    
    // Small grid lines (vertical)
    const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    for (let i = 0; i <= width; i += smallGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        objectCaching: false,
      });
      line.set('isGrid', true);
      gridLines.push(line);
    }
    
    // Small grid lines (horizontal)
    for (let i = 0; i <= height; i += smallGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        objectCaching: false,
      });
      line.set('isGrid', true);
      gridLines.push(line);
    }
    
    // Large grid lines (vertical)
    const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
    for (let i = 0; i <= width; i += largeGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        objectCaching: false,
      });
      line.set('isGrid', true);
      line.set('isLargeGrid', true);
      gridLines.push(line);
    }
    
    // Large grid lines (horizontal)
    for (let i = 0; i <= height; i += largeGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        objectCaching: false,
      });
      line.set('isGrid', true);
      line.set('isLargeGrid', true);
      gridLines.push(line);
    }
    
    return gridLines;
  }, [canvas]);
  
  // Show grid lines
  const showGrid = useCallback(() => {
    if (!canvas) return;
    
    // Remove existing grid lines
    gridLinesRef.current.forEach(line => {
      if (canvas.contains(line)) {
        canvas.remove(line);
      }
    });
    
    // Create new grid lines
    const gridLines = createGridLines();
    
    // Add to canvas
    gridLines.forEach(line => {
      canvas.add(line);
      canvas.sendToBack(line);
    });
    
    // Update ref
    gridLinesRef.current = gridLines;
    
    // Update state
    setIsVisible(true);
    
    // Render canvas
    canvas.renderAll();
  }, [canvas, createGridLines]);
  
  // Hide grid lines
  const hideGrid = useCallback(() => {
    if (!canvas) return;
    
    // Remove existing grid lines
    gridLinesRef.current.forEach(line => {
      if (canvas.contains(line)) {
        canvas.remove(line);
      }
    });
    
    // Clear ref
    gridLinesRef.current = [];
    
    // Update state
    setIsVisible(false);
    
    // Render canvas
    canvas.renderAll();
  }, [canvas]);
  
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    if (isVisible) {
      hideGrid();
    } else {
      showGrid();
    }
  }, [isVisible, hideGrid, showGrid]);
  
  // Update grid size
  const updateGridSize = useCallback((size: number) => {
    setGridSize(size);
    if (isVisible) {
      hideGrid();
      showGrid();
    }
  }, [isVisible, hideGrid, showGrid]);
  
  // Initialize grid
  useEffect(() => {
    if (!canvas) return;
    
    // Show grid if initial visibility is true
    if (initialVisible) {
      showGrid();
    }
    
    return () => {
      hideGrid();
    };
  }, [canvas, initialVisible, showGrid, hideGrid]);
  
  return {
    isVisible,
    gridSize,
    showGrid,
    hideGrid,
    toggleGrid,
    updateGridSize,
    gridLines: gridLinesRef.current
  };
};

export default useCanvasGrid;
