import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';
import { captureError } from '@/utils/sentryUtils';

interface CanvasInitializerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dimensions: { width: number; height: number };
  setFabricCanvas: (canvas: FabricCanvas) => void;
  setCanvas: (canvas: FabricCanvas) => void;
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
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      renderOnAddRemove: false // Disable automatic rendering for better control
    });
    
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
const updateGridWithZoom = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Get existing grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If no grid objects, nothing to update
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Adjust grid objects based on zoom if needed
    const zoom = canvas.getZoom();
    gridObjects.forEach(obj => {
      // Adjust stroke width based on zoom
      const isLargeGrid = (obj as any).isLargeGrid;
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
    captureError(new Error('Canvas initialization failed'), { 
      context: 'canvas-initializer',
      originalError: error 
    });
    return false;
  }
};
