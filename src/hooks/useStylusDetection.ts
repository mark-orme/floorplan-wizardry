
/**
 * Custom hook for stylus detection and handling
 * @module useStylusDetection
 */
import { useCallback, useEffect, useState } from "react";
import { isIOSPlatform, applyIOSEventFixes } from "@/utils/fabric/events";

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
  const [hasStylusSupport, setHasStylusSupport] = useState(false);
  const [isApplePencil, setIsApplePencil] = useState(false);
  
  // Add specific handler for stylus events
  const handleStylusDetection = useCallback(() => {
    // Check if stylus is supported in the browser
    const hasStylus = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0 && 
                     ('ontouchstart' in window || (window as any).DocumentTouch);
                     
    setHasStylusSupport(hasStylus);
    
    // Detect iOS for Apple Pencil
    const isIOS = isIOSPlatform();
    const potentialApplePencil = isIOS && hasStylus;
    
    if (potentialApplePencil) {
      setIsApplePencil(true);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Potential Apple Pencil support detected");
      }
    }
    
    if (hasStylus && process.env.NODE_ENV === 'development') {
      console.log("Stylus support detected, iOS:", isIOS);
    }
    
    // Add stylus-specific event listeners to the canvas container
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      
      // Apply iOS fixes
      if (isIOS) {
        applyIOSEventFixes(canvasElement);
        
        // Test if force property is available (for Apple Pencil)
        const checkForceHandler = (e: TouchEvent) => {
          if (e.touches[0] && 'force' in e.touches[0]) {
            setIsApplePencil(true);
            console.log("Apple Pencil force detected:", e.touches[0].force);
          }
        };
        
        canvasElement.addEventListener('touchstart', checkForceHandler, { once: true });
      }
      
      // Prevent scrolling when using stylus
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
  
  // Add viewport meta tag to disable scaling on iOS
  useEffect(() => {
    if (isIOSPlatform()) {
      // Add meta viewport to disable scaling
      let metaViewport = document.querySelector('meta[name="viewport"]');
      if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        document.head.appendChild(metaViewport);
      }
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      
      // Prevent double-tap to zoom on iOS
      const preventDoubleTapZoom = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
      
      return () => {
        document.removeEventListener('touchend', preventDoubleTapZoom);
      };
    }
  }, []);

  return {
    handleStylusDetection,
    hasStylusSupport,
    isApplePencil
  };
};
