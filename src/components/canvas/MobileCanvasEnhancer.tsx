
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

interface MobileCanvasEnhancerProps {
  canvas: FabricCanvas;
}

export const MobileCanvasEnhancer: React.FC<MobileCanvasEnhancerProps> = ({ canvas }) => {
  useEffect(() => {
    if (!canvas || !canvas.wrapperEl) return;
    
    // Detect if running on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (!isMobile) {
      logger.info('Mobile enhancements skipped - not a mobile device');
      return;
    }
    
    logger.info('Applying mobile canvas enhancements');
    
    try {
      // Apply mobile-specific classes
      canvas.wrapperEl.classList.add('mobile-canvas-wrapper');
      canvas.wrapperEl.classList.add('touch-optimized-canvas');
      
      // Detect iOS specifically
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        canvas.wrapperEl.classList.add('ios-canvas');
      }
      
      // Optimize touch settings
      if (canvas.upperCanvasEl) {
        canvas.upperCanvasEl.style.touchAction = 'none';
        // Fix TypeScript issue by using setAttribute instead of direct property assignment
        canvas.upperCanvasEl.setAttribute('style', 
          `${canvas.upperCanvasEl.getAttribute('style') || ''}; -webkit-tap-highlight-color: transparent;`);
      }
      
      // Adjust brush size for touch
      if (canvas.freeDrawingBrush) {
        const originalWidth = canvas.freeDrawingBrush.width;
        canvas.freeDrawingBrush.width = originalWidth * 1.5; // Slightly thicker for touch
      }
      
      // Update event listener types
      const addPassiveListener = (element: HTMLElement, event: string, handler: EventListener) => {
        element.addEventListener(event, handler, { passive: false });
        
        return () => {
          element.removeEventListener(event, handler);
        };
      };
      
      // Prevent page scrolling when interacting with canvas
      const preventScroll = (e: Event) => {
        if (e.target === canvas.upperCanvasEl) {
          e.preventDefault();
        }
      };
      
      // Apply passive listeners
      const removeListeners: Array<() => void> = [];
      
      if (canvas.wrapperEl) {
        removeListeners.push(
          addPassiveListener(canvas.wrapperEl, 'touchstart', preventScroll as EventListener),
          addPassiveListener(canvas.wrapperEl, 'touchmove', preventScroll as EventListener)
        );
      }
      
      logger.info('Mobile canvas enhancements applied successfully');
      
      // Cleanup function
      return () => {
        removeListeners.forEach(remove => remove());
        logger.info('Mobile canvas enhancements cleaned up');
      };
    } catch (error) {
      logger.error('Error applying mobile canvas enhancements:', error);
    }
  }, [canvas]);
  
  return null;
};
