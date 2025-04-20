
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = 50,
  initialVisible = true
}: UseGridProps) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [isGridVisible, setIsGridVisible] = useState(initialVisible);

  const createGrid = useCallback((canvas?: FabricCanvas) => {
    const targetCanvas = canvas || fabricCanvasRef.current;
    if (!targetCanvas) return [];

    const width = targetCanvas.width || 1000;
    const height = targetCanvas.height || 1000;
    const gridObjects: FabricObject[] = [];

    // Clear any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (targetCanvas.contains(obj)) {
          targetCanvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }

    // Create horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        objectType: 'grid',
        visible: isGridVisible
      });
      targetCanvas.add(line);
      gridObjects.push(line);
    }

    // Create vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        objectType: 'grid',
        visible: isGridVisible
      });
      targetCanvas.add(line);
      gridObjects.push(line);
    }

    // Send grid to the back
    gridObjects.forEach(obj => obj.sendToBack());
    
    // Update the ref
    gridLayerRef.current = gridObjects;
    
    // Render the canvas
    targetCanvas.requestRenderAll();
    
    return gridObjects;
  }, [fabricCanvasRef, gridSize, isGridVisible, gridLayerRef]);

  const toggleGridVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newVisibility = !isGridVisible;
    setIsGridVisible(newVisibility);

    gridLayerRef.current.forEach(obj => {
      obj.set('visible', newVisibility);
    });

    canvas.requestRenderAll();
  }, [fabricCanvasRef, isGridVisible, gridLayerRef]);

  const snapToGrid = useCallback((point: Point): Point => {
    const newX = Math.round(point.x / gridSize) * gridSize;
    const newY = Math.round(point.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  }, [gridSize]);

  return {
    gridSize,
    setGridSize,
    isGridVisible,
    createGrid,
    toggleGridVisibility,
    snapToGrid
  };
};
