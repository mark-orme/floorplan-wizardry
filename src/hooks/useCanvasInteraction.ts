
/**
 * Custom hook for canvas interaction features
 * @module useCanvasInteraction
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { addPinchToZoom } from "@/utils/fabricInteraction";

/**
 * Hook to handle canvas interaction features like zooming and panning
 */
export const useCanvasInteraction = () => {
  const historyRef = useRef<{past: any[][], future: any[][]}>(
    { past: [], future: [] }
  );

  /**
   * Setup interaction handlers for the canvas
   */
  const setupInteractions = useCallback((fabricCanvas: FabricCanvas) => {
    if (!fabricCanvas) return;
    
    // Add pinch-to-zoom - fixed signature to match implementation
    addPinchToZoom(fabricCanvas);
    
    // Initialize history with current state only if there are actual objects
    const initialState = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'path' || obj.type === 'polyline'
    );
    
    if (initialState.length > 0) {
      historyRef.current.past.push([...initialState]);
    }
    
    // Optimize object:added event with throttling
    let objectAddedThrottled = false;
    const ensureGridInBackground = () => {
      if (objectAddedThrottled) return;
      
      objectAddedThrottled = true;
      setTimeout(() => {
        objectAddedThrottled = false;
      }, 100);
    };
    
    fabricCanvas.on('object:added', ensureGridInBackground);
    
    // Return cleanup function
    return () => {
      fabricCanvas.off('object:added', ensureGridInBackground);
    };
  }, []);

  return {
    historyRef,
    setupInteractions
  };
};
