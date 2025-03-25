
/**
 * Custom hook for stylus detection and handling
 * @module useStylusDetection
 */
import { useCallback, useEffect } from "react";

interface UseStylusDetectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  debugInfo: {
    canvasInitialized: boolean;
  };
}

/**
 * Hook for detecting and handling stylus input devices
 */
export const useStylusDetection = ({
  canvasRef,
  debugInfo
}: UseStylusDetectionProps) => {

  // Add specific handler for stylus events
  const handleStylusDetection = useCallback(() => {
    // Check if stylus is supported in the browser
    const hasStylus = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0 && 
                     ('ontouchstart' in window || (window as any).DocumentTouch);
                     
    if (hasStylus && process.env.NODE_ENV === 'development') {
      console.log("Stylus support detected");
    }
    
    // Add stylus-specific event listeners to the canvas container
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      
      // Prevent scrolling when using Apple Pencil
      canvasElement.addEventListener('touchmove', (e: TouchEvent) => {
        // If there's pressure data, likely a stylus, so prevent page scrolling
        if (e.touches[0] && 'force' in e.touches[0]) {
          e.preventDefault();
        }
      }, { passive: false });
      
      // Prevent context menu on long press
      canvasElement.addEventListener('contextmenu', (e: Event) => {
        e.preventDefault();
      });
    }
  }, [canvasRef]);
  
  // Initialize stylus detection once canvas is created
  useEffect(() => {
    if (canvasRef.current && debugInfo.canvasInitialized) {
      handleStylusDetection();
    }
  }, [canvasRef, debugInfo.canvasInitialized, handleStylusDetection]);

  return {
    handleStylusDetection
  };
};
