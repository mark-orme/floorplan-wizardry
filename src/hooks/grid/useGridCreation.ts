
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createGrid } from '@/utils/canvasGrid';

interface UseGridCreationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  smallGridSize?: number;
  largeGridSize?: number;
  enabled?: boolean;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
}

interface GridOptions {
  smallGridSize?: number;
  largeGridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
}

export const useGridCreation = ({
  fabricCanvasRef,
  smallGridSize = 10,
  largeGridSize = 50,
  enabled = true,
  smallGridColor = '#e0e0e0',
  largeGridColor = '#c0c0c0',
  smallGridWidth = 0.5,
  largeGridWidth = 1
}: UseGridCreationProps) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const isGridCreatedRef = useRef<boolean>(false);
  
  const createCanvasGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !enabled) return;
    
    // Clear existing grid objects
    if (gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridObjectsRef.current = [];
    }
    
    // Create new grid
    const options: GridOptions = {
      smallGridSize,
      largeGridSize,
      smallGridColor,
      largeGridColor,
      smallGridWidth,
      largeGridWidth
    };
    
    try {
      const gridObjects = createGrid(canvas, options);
      if (Array.isArray(gridObjects) && gridObjects.length > 0) {
        gridObjectsRef.current = gridObjects;
        isGridCreatedRef.current = true;
      } else {
        console.warn('Grid creation returned no objects');
      }
    } catch (err) {
      console.error('Failed to create grid:', err);
    }
  }, [
    fabricCanvasRef,
    enabled,
    smallGridSize,
    largeGridSize,
    smallGridColor,
    largeGridColor,
    smallGridWidth,
    largeGridWidth
  ]);
  
  // Create grid when component mounts or when parameters change
  useEffect(() => {
    createCanvasGrid();
  }, [createCanvasGrid]);
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Remove grid objects
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    };
  }, [fabricCanvasRef]);
  
  return {
    createGrid: createCanvasGrid,
    isGridCreated: isGridCreatedRef.current,
    gridObjects: gridObjectsRef.current
  };
};

// Add missing type for FabricObject
type FabricObject = any;

export default useGridCreation;
