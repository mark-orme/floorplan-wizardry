
/**
 * Hook for managing grid functionality
 * @module hooks/useGrid
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export interface UseGridResult {
  gridSize: number;
  setGridSize: (size: number) => void;
  isGridVisible: boolean;
  toggleGridVisibility: () => void;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  snapToGrid: (value: number) => number;
}

/**
 * Hook for managing grid creation and visibility
 * @param props Hook properties
 * @returns Grid state and functions
 */
export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = 50,
  initialVisible = true
}: UseGridProps): UseGridResult => {
  const [gridSize, setGridSize] = useState<number>(initialGridSize);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(initialVisible);

  /**
   * Snap a value to the nearest grid line
   * @param value Value to snap
   * @returns Snapped value
   */
  const snapToGrid = useCallback((value: number): number => {
    return Math.round(value / gridSize) * gridSize;
  }, [gridSize]);

  /**
   * Toggle grid visibility
   */
  const toggleGridVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const gridObjects = gridLayerRef.current;
    const visible = !isGridVisible;

    // Update grid object visibility
    gridObjects.forEach(obj => {
      // Use obj.visible = visible instead of setZIndex
      obj.visible = visible;
    });

    // Render canvas
    canvas.requestRenderAll();
    setIsGridVisible(visible);
  }, [fabricCanvasRef, gridLayerRef, isGridVisible]);

  /**
   * Create grid lines
   * @param canvas Canvas to add grid to
   * @returns Array of grid objects
   */
  const createGrid = useCallback((canvas: FabricCanvas): FabricObject[] => {
    const gridObjects: FabricObject[] = [];
    const canvasWidth = canvas.getWidth() || 800;
    const canvasHeight = canvas.getHeight() || 600;
    
    // Create horizontal grid lines
    for (let i = 0; i < canvasHeight; i += gridSize) {
      const line = new fabric.Line([0, i, canvasWidth, i], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        visible: isGridVisible
      });
      
      // Mark as grid for filtering in other operations
      (line as any).isGrid = true;
      
      // Add to canvas and grid objects
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i < canvasWidth; i += gridSize) {
      const line = new fabric.Line([i, 0, i, canvasHeight], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        visible: isGridVisible
      });
      
      // Mark as grid for filtering in other operations
      (line as any).isGrid = true;
      
      // Add to canvas and grid objects
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back
    gridObjects.forEach(obj => {
      // Move grid lines to the back
      canvas.sendObjectToBack(obj);
    });
    
    // Render canvas
    canvas.requestRenderAll();
    
    return gridObjects;
  }, [gridSize, isGridVisible]);

  return {
    gridSize,
    setGridSize,
    isGridVisible,
    toggleGridVisibility,
    createGrid,
    snapToGrid
  };
};
