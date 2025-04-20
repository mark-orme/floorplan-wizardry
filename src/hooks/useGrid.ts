
/**
 * Hook for grid creation and management
 * @module useGrid
 */
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { Point } from "@/types/floor-plan/typesBarrel";

interface UseGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = (props: UseGridProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    initialGridSize = 50,
    initialVisible = true
  } = props;
  
  // Grid state
  const [gridSize, setGridSize] = useState<number>(initialGridSize);
  const [gridVisible, setGridVisible] = useState<boolean>(initialVisible);
  
  /**
   * Create a grid of lines on the canvas
   * @param canvas Fabric canvas reference
   * @param size Grid size
   * @returns Array of grid lines
   */
  const createGrid = useCallback((canvas: FabricCanvas, size: number = gridSize): FabricObject[] => {
    if (!canvas) {
      console.error("Cannot create grid: Canvas is null");
      return [];
    }
    
    const width = canvas.getWidth() || 800;
    const height = canvas.getHeight() || 600;
    
    console.log(`Creating grid (${width}x${height}) with size ${size}`);
    
    // Remove any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        canvas.remove(obj);
      });
      
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += size) {
      const line = new Line([0, i, width, i], {
        stroke: "#ccc",
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: "grid",
        name: "gridLine",
        hoverCursor: "default"
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += size) {
      const line = new Line([i, 0, i, height], {
        stroke: "#ccc",
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: "grid",
        name: "gridLine",
        hoverCursor: "default"
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Send grid to back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    canvas.requestRenderAll();
    
    return gridObjects;
  }, [gridSize, gridLayerRef]);
  
  /**
   * Toggle grid visibility
   * @returns New visibility state
   */
  const toggleGridVisibility = useCallback((): boolean => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      console.error("Cannot toggle grid: Canvas is null");
      return gridVisible;
    }
    
    const newVisibility = !gridVisible;
    
    // Update grid visibility
    gridLayerRef.current.forEach(obj => {
      obj.set('visible', newVisibility);
    });
    
    canvas.requestRenderAll();
    setGridVisible(newVisibility);
    
    return newVisibility;
  }, [gridVisible, fabricCanvasRef, gridLayerRef]);
  
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @returns Snapped point
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!point) return { x: 0, y: 0 };
    
    // Calculate the nearest grid intersection
    const x = Math.round(point.x / gridSize) * gridSize;
    const y = Math.round(point.y / gridSize) * gridSize;
    
    return { x, y };
  }, [gridSize]);
  
  return {
    gridSize,
    setGridSize,
    createGrid,
    toggleGridVisibility,
    snapToGrid,
    isGridVisible: gridVisible
  };
};
