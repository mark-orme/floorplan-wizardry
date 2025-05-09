import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UseCanvasGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = 20,
  initialVisible = true
}: UseCanvasGridProps) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [gridVisible, setGridVisible] = useState(initialVisible);

  const createGrid = useCallback((canvas: FabricCanvas) => {
    if (!canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    if (!width || !height) return;

    const gridLines: FabricObject[] = [];
    const lineOptions = {
      stroke: GRID_CONSTANTS.GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: false,
      excludeFromExport: true,
      gridObject: true
    };

    // Vertical lines
    for (let i = 0; i <= (width / gridSize); i++) {
      const lineWidth = (i % 5 === 0) ? 1 : 0.5;
      const lineColor = (i % 5 === 0) ? GRID_CONSTANTS.GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR;

      const line = new FabricObject.Line([i * gridSize, 0, i * gridSize, height], {
        ...lineOptions,
        stroke: lineColor,
        strokeWidth: lineWidth
      });
      gridLines.push(line);
    }

    // Horizontal lines
    for (let j = 0; j <= (height / gridSize); j++) {
      const lineWidth = (j % 5 === 0) ? 1 : 0.5;
      const lineColor = (j % 5 === 0) ? GRID_CONSTANTS.GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR;

      const line = new FabricObject.Line([0, j * gridSize, width, j * gridSize], {
        ...lineOptions,
        stroke: lineColor,
        strokeWidth: lineWidth
      });
      gridLines.push(line);
    }

    gridLayerRef.current = gridLines;
    canvas.add(...gridLines);
    canvas.sendToBack(...gridLines);
    canvas.requestRenderAll();
  }, [gridSize, gridLayerRef]);

  const toggleGridVisibility = useCallback(() => {
    setGridVisible(prev => !prev);
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (gridVisible) {
      if (gridLayerRef.current.length === 0) {
        createGrid(canvas);
      } else {
        gridLayerRef.current.forEach(line => {
          if (canvas.contains(line)) {
            line.visible = true;
          } else {
            canvas.add(line);
          }
          canvas.sendToBack(line);
        });
        canvas.requestRenderAll();
      }
    } else {
      gridLayerRef.current.forEach(line => {
        line.visible = false;
      });
      canvas.requestRenderAll();
    }
  }, [gridVisible, fabricCanvasRef, gridLayerRef, createGrid]);

  const setGrid = useCallback((canvas: FabricCanvas) => {
    if (!canvas) return;

    createGrid(canvas);
  }, [createGrid]);

  const updateGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove existing grid lines
    if (gridLayerRef.current.length > 0) {
      canvas.remove(...gridLayerRef.current);
      gridLayerRef.current = [];
    }

    // Create and add new grid lines
    createGrid(canvas);
  }, [createGrid, fabricCanvasRef, gridLayerRef]);

  const setGridCellSize = useCallback((newSize: number) => {
    setGridSize(newSize);
  }, []);

  const snapToGrid = useCallback((point: { x: number; y: number }) => {
    const x = Math.round(point.x / gridSize) * gridSize;
    const y = Math.round(point.y / gridSize) * gridSize;
    return { x, y };
  }, [gridSize]);

  // Update the GRID_CONSTANTS with all required properties
  const GRID_CONSTANTS = {
    SMALL_GRID: 10,
    LARGE_GRID: 50,
    GRID_COLOR: '#cccccc',
    LARGE_GRID_COLOR: '#999999',
    PIXELS_PER_METER: 100,
    SMALL_GRID_COLOR: '#dddddd',
    SMALL_GRID_WIDTH: 0.5,
    SMALL_GRID_SIZE: 10, // Add this
    LARGE_GRID_SIZE: 50, // Add this
    LARGE_GRID_WIDTH: 1   // Add this
  };

  return {
    gridSize,
    setGridSize: setGridCellSize,
    gridVisible,
    setGridVisible,
    createGrid,
    setGrid,
    updateGrid,
    toggleGridVisibility,
    snapToGrid,
    GRID_CONSTANTS
  };
};
