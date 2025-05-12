import { useEffect, useCallback } from 'react';
import { Canvas } from 'fabric';

/**
 * Hook for initializing and configuring a Fabric.js canvas
 */
export const useCanvasInit = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options = {}
) => {
  // Initialize the canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    try {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        ...options
      });
      
      return canvas;
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      return null;
    }
  }, [canvasRef, options]);
  
  // Set up canvas configuration
  const configureCanvas = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    
    // Safe method call
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }
    
    // Additional canvas configuration
  }, []);
  
  return {
    initializeCanvas,
    configureCanvas
  };
};

export default useCanvasInit;
