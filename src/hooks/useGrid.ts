
import { useCallback, useEffect, useState } from 'react';
import { Canvas } from 'fabric';
import * as fabric from 'fabric';
import { SMALL_GRID_SIZE, LARGE_GRID_SIZE, SMALL_GRID_COLOR, LARGE_GRID_COLOR } from '@/constants/gridConstants';
import { ExtendedFabricCanvas, asExtendedObject } from '@/types/canvas-types';

interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | ExtendedFabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<fabric.Object[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = SMALL_GRID_SIZE,
  initialVisible = true
}: UseGridProps) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [visible, setVisible] = useState(initialVisible);

  const createGrid = useCallback((canvas: Canvas | ExtendedFabricCanvas) => {
    if (!canvas) return;

    // Clear existing grid lines
    gridLayerRef.current.forEach(obj => {
      canvas.remove(obj);
    });

    const gridObjects: fabric.Object[] = [];
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Create vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % LARGE_GRID_SIZE === 0;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? 1 : 0.5,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(asExtendedObject(line));
      gridObjects.push(line);
    }

    // Create horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % LARGE_GRID_SIZE === 0;
      const line = new fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? 1 : 0.5,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(asExtendedObject(line));
      gridObjects.push(line);
    }

    // Send all grid lines to the back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });

    // Store the grid objects reference
    gridLayerRef.current = gridObjects;

    // Render the canvas
    canvas.renderAll();

    return gridObjects;
  }, [gridLayerRef, gridSize, visible]);

  // Update grid visibility when visible state changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    gridLayerRef.current.forEach(obj => {
      if (obj) {
        (obj as any).visible = visible;
      }
    });

    canvas.renderAll();
  }, [fabricCanvasRef, gridLayerRef, visible]);

  return {
    gridSize,
    visible,
    setGridSize,
    setVisible,
    createGrid,
    toggleGrid: () => setVisible(!visible)
  };
};
