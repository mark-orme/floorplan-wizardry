
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

/**
 * Hook for managing canvas grid
 * 
 * @param {UseGridProps} props - Hook properties
 * @returns Grid utility functions and state
 */
export const useGrid = (props: UseGridProps) => {
  const { 
    fabricCanvasRef, 
    gridLayerRef, 
    initialGridSize = 50, 
    initialVisible = true 
  } = props;
  
  // State
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isSnapping, setIsSnapping] = useState(false);
  
  /**
   * Create grid on the canvas
   * 
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @param {number} [size] - Grid size
   * @returns {FabricObject[]} Created grid objects
   */
  const createGrid = useCallback((canvas: FabricCanvas, size?: number): FabricObject[] => {
    if (!canvas) return [];
    
    const gridSize = size || initialGridSize;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        objectCaching: false,
        visible: isVisible
      });
      (line as any).objectType = 'grid';
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i < height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        objectCaching: false,
        visible: isVisible
      });
      (line as any).objectType = 'grid';
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  }, [initialGridSize, isVisible]);
  
  /**
   * Toggle grid visibility
   * 
   * @param {boolean} [visible] - Force visibility state
   */
  const toggleGridVisibility = useCallback((visible?: boolean) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const newVisibility = visible !== undefined ? visible : !isVisible;
    
    gridLayerRef.current.forEach(obj => {
      obj.set('visible', newVisibility);
    });
    
    canvas.requestRenderAll();
    setIsVisible(newVisibility);
  }, [fabricCanvasRef, gridLayerRef, isVisible]);
  
  /**
   * Snap point to grid
   * 
   * @param {{ x: number, y: number }} point - Point to snap
   * @returns {{ x: number, y: number }} Snapped point
   */
  const snapToGrid = useCallback((point: { x: number, y: number }) => {
    if (!isSnapping) return point;
    
    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: snappedX, y: snappedY };
  }, [gridSize, isSnapping]);
  
  return {
    gridSize,
    setGridSize,
    isVisible,
    isSnapping,
    setIsSnapping,
    createGrid,
    toggleGridVisibility,
    snapToGrid
  };
};
