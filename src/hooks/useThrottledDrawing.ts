
/**
 * Hook for throttled drawing events
 * Optimizes high-frequency events for smooth canvas operations
 * @module hooks/useThrottledDrawing
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { throttleRAF } from '@/utils/canvas/throttle';
import { 
  optimizeForStylus, 
  preventTouchBehaviors, 
  addThrottledPressureSensitivity 
} from '@/utils/canvas/canvasHelpers';

interface UseThrottledDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  isDrawing: boolean;
}

/**
 * Hook for optimizing drawing performance with throttled events
 * Handles pressure sensitivity and prevents unwanted gestures
 */
export const useThrottledDrawing = ({
  fabricCanvasRef,
  tool,
  isDrawing
}: UseThrottledDrawingProps) => {
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  
  // Throttled event handler for smooth drawing
  const handleThrottledMove = useCallback(throttleRAF((e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.isDrawingMode) return;
    
    // The event handling is already throttled, fabric.js will handle
    // the actual drawing operations efficiently
  }), [fabricCanvasRef]);
  
  // Setup optimization for drawing tools
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Only set up optimizations for drawing tools
    const isDrawingTool = tool === DrawingMode.DRAW || 
                          tool === DrawingMode.STRAIGHT_LINE || 
                          tool === DrawingMode.WALL;
    
    if (isDrawingTool) {
      console.log('Setting up throttled drawing for', tool);
      const canvasEl = canvas.getElement();
      
      // Optimize for stylus if in drawing mode
      optimizeForStylus(canvas);
      
      // Set up pressure sensitivity with throttling
      const pressureCleanup = addThrottledPressureSensitivity(canvas);
      
      // Prevent unwanted touch behaviors like scrolling/zooming
      const touchCleanup = preventTouchBehaviors(canvasEl);
      
      // Add throttled event handler
      canvasEl.addEventListener('pointermove', handleThrottledMove, { passive: true });
      
      // Store cleanup functions
      cleanupFunctionsRef.current = [
        pressureCleanup,
        touchCleanup,
        () => canvasEl.removeEventListener('pointermove', handleThrottledMove)
      ];
      
      return () => {
        // Clean up all optimizations when unmounting or changing tools
        cleanupFunctionsRef.current.forEach(cleanup => cleanup());
        cleanupFunctionsRef.current = [];
      };
    }
  }, [fabricCanvasRef, tool, handleThrottledMove]);
  
  // Update drawing experience based on isDrawing state
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (isDrawing) {
      // When actively drawing, make sure touch actions are disabled
      canvas.getElement().style.touchAction = 'none';
    } else {
      // When not drawing, allow normal touch actions
      canvas.getElement().style.touchAction = '';
    }
  }, [fabricCanvasRef, isDrawing]);
  
  return {
    // Expose any useful methods or state if needed
    cleanup: useCallback(() => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
    }, [])
  };
};
