
import { RefObject } from 'react';
import { Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

interface UseGridParams {
  fabricCanvasRef: RefObject<ExtendedFabricCanvas | null>;
  gridLayerRef: RefObject<FabricObject[]>;
  initialGridSize?: number;
  initialVisible?: boolean;
}

export const useGrid = ({
  fabricCanvasRef,
  gridLayerRef,
  initialGridSize = 20,
  initialVisible = true
}: UseGridParams) => {
  const createGrid = (canvas: ExtendedFabricCanvas) => {
    if (!canvas) return [];
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: FabricObject[] = [];
    
    // Implementation stub
    console.log(`Creating grid with size ${initialGridSize} on canvas ${width}x${height}`);
    
    return objects;
  };
  
  const toggleGridVisibility = (visible: boolean) => {
    const grid = gridLayerRef.current || [];
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) return;
    
    grid.forEach((obj) => {
      if (obj) {
        obj.set({ visible });
      }
    });
    
    canvas.requestRenderAll();
  };
  
  return {
    createGrid,
    toggleGridVisibility,
    isGridVisible: initialVisible,
    gridSize: initialGridSize
  };
};
