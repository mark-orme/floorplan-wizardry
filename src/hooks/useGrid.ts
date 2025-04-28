
import { useCallback, useState } from 'react';
import { fabric } from 'fabric';
import { ExtendedFabricCanvas, asExtendedCanvas } from '@/types/canvas-types';

interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<fabric.Object[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = 20,
  initialVisible = true
}: UseGridProps) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [isGridVisible, setIsGridVisible] = useState(initialVisible);

  // Create a grid on the canvas
  const createGrid = useCallback((canvas: ExtendedFabricCanvas) => {
    if (!canvas) return [];
    
    // Clear any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => canvas.remove(obj));
      gridLayerRef.current = [];
    }
    
    const gridObjects: fabric.Object[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      const isLargeLine = y % (gridSize * 5) === 0;
      const lineWidth = isLargeLine ? 1 : 0.5;
      const lineColor = isLargeLine ? '#c0c0c0' : '#e0e0e0';
      
      const line = new fabric.Line([0, y, canvasWidth, y], {
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        strokeDashArray: isLargeLine ? [] : [5, 5]
      });
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).isLargeGrid = isLargeLine;
      
      // Set visibility based on state
      line.visible = isGridVisible;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      const isLargeLine = x % (gridSize * 5) === 0;
      const lineWidth = isLargeLine ? 1 : 0.5;
      const lineColor = isLargeLine ? '#c0c0c0' : '#e0e0e0';
      
      const line = new fabric.Line([x, 0, x, canvasHeight], {
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        strokeDashArray: isLargeLine ? [] : [5, 5]
      });
      
      // Add custom properties to identify grid lines
      (line as any).isGrid = true;
      (line as any).isLargeGrid = isLargeLine;
      
      // Set visibility based on state
      line.visible = isGridVisible;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid objects to back
    if (canvas.sendToBack) {
      gridObjects.forEach(obj => canvas.sendToBack(obj));
    }
    
    // Store grid objects in ref
    gridLayerRef.current = gridObjects;
    
    // Render canvas
    canvas.requestRenderAll();
    
    return gridObjects;
  }, [gridSize, isGridVisible, gridLayerRef]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Toggle visibility state
    const newVisibility = !isGridVisible;
    setIsGridVisible(newVisibility);
    
    // Update grid objects visibility
    gridLayerRef.current.forEach(obj => {
      obj.visible = newVisibility;
    });
    
    // Render canvas
    canvas.requestRenderAll();
  }, [fabricCanvasRef, gridLayerRef, isGridVisible]);
  
  // Snap a point to the grid
  const snapToGrid = useCallback((point: { x: number, y: number }) => {
    const x = Math.round(point.x / gridSize) * gridSize;
    const y = Math.round(point.y / gridSize) * gridSize;
    return { x, y };
  }, [gridSize]);
  
  // Update grid size
  const updateGridSize = useCallback((size: number) => {
    setGridSize(size);
    
    // Recreate grid with new size
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      createGrid(canvas);
    }
  }, [fabricCanvasRef, createGrid]);
  
  return {
    gridSize,
    isGridVisible,
    createGrid,
    toggleGridVisibility,
    snapToGrid,
    updateGridSize,
    setGridSize
  };
};
