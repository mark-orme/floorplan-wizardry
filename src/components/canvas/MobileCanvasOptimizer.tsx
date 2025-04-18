
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface MobileCanvasOptimizerProps {
  canvas: FabricCanvas | null;
}

export const MobileCanvasOptimizer: React.FC<MobileCanvasOptimizerProps> = ({ canvas }) => {
  useEffect(() => {
    if (!canvas) return;

    // Detect if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log("Mobile device detected, applying optimizations");
      
      // Add mobile-specific classes to canvas container
      if (canvas.wrapperEl) {
        canvas.wrapperEl.classList.add('touch-optimized-canvas');
        
        // Check if iOS device for specific optimizations
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          canvas.wrapperEl.classList.add('ios-canvas');
        }
      }
      
      // Enable touch scrolling for pan operations
      canvas.allowTouchScrolling = true;
      
      // Optimize brush for touch input
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 3; // Slightly thicker lines for touch
      }
      
      // Additional canvas settings for mobile
      canvas.selection = true;
      canvas.preserveObjectStacking = true;
    }
    
    return () => {
      if (canvas && canvas.wrapperEl) {
        canvas.wrapperEl.classList.remove('touch-optimized-canvas', 'ios-canvas');
      }
    };
  }, [canvas]);

  return null; // This is a non-visual component
};
