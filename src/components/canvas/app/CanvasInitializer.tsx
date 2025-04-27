
import { useEffect, useRef } from 'react';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

interface CanvasInitializerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dimensions: { width: number; height: number };
  setFabricCanvas: (canvas: ExtendedCanvas) => void;
  setCanvas: (canvas: ExtendedCanvas) => void;
}

export const CanvasInitializer: React.FC<CanvasInitializerProps> = ({
  canvasRef,
  dimensions,
  setFabricCanvas,
  setCanvas
}) => {
  // Initialize canvas with performance optimizations
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Properly cast to ExtendedCanvas
    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      renderOnAddRemove: false // Disable automatic rendering for better control
    }) as unknown as ExtendedCanvas;
    
    // Add zoom event listener for grid scaling
    canvas.on('mouse:wheel', () => {
      updateGridWithZoom(canvas);
      requestOptimizedRender(canvas, 'zoom');
    });
    
    setFabricCanvas(canvas);
    setCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, [canvasRef, dimensions.width, dimensions.height, setCanvas, setFabricCanvas]);

  return null;
};

// Helper to update grid when zoom changes
const updateGridWithZoom = (canvas: ExtendedCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Get existing grid objects
    const gridObjects = canvas.getObjects().filter(obj => {
      const fabricObj = obj as any;
      return fabricObj.objectType === 'grid' || fabricObj.isGrid === true;
    });
    
    // If no grid objects, nothing to update
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Adjust grid objects based on zoom if needed
    const zoom = canvas.getZoom();
    gridObjects.forEach(obj => {
      // Adjust stroke width based on zoom
      const fabricObj = obj as any;
      const isLargeGrid = fabricObj.isLargeGrid;
      const baseWidth = isLargeGrid ? 
        GRID_CONSTANTS.LARGE_GRID_WIDTH : 
        GRID_CONSTANTS.SMALL_GRID_WIDTH;
      
      // Inverse relationship with zoom to maintain visual consistency
      obj.set('strokeWidth', baseWidth / Math.max(0.5, zoom));
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error updating grid with zoom:', error);
    return false;
  }
};
