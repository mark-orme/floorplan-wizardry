
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { updateGridWithZoom } from '@/utils/grid/gridVisibility';
import { optimizeCanvasPerformance, requestOptimizedRender } from '@/utils/canvas/renderOptimizer';

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
    canvas.on('zoom:changed', () => {
      updateGridWithZoom(canvas);
      requestOptimizedRender(canvas, 'zoom');
    });
    
    // Apply performance optimizations
    optimizeCanvasPerformance(canvas);
    
    setFabricCanvas(canvas);
    setCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, [canvasRef, dimensions.width, dimensions.height, setCanvas, setFabricCanvas]);

  return null;
};
