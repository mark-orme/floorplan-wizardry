
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
      
      // Prevent page scrolling when interacting with canvas
      const preventScroll = (e: Event) => {
        if (e.target === canvas.upperCanvasEl) {
          e.preventDefault();
        }
      };
      
      // Apply event listeners with proper type handling
      const removeListeners: Array<() => void> = [];
      
      if (canvas.wrapperEl) {
        // Handle touchstart
        const handleTouchStart = (e: TouchEvent) => {
          if (e.target === canvas.upperCanvasEl) {
            e.preventDefault();
          }
        };
        
        // Handle touchmove
        const handleTouchMove = (e: TouchEvent) => {
          if (e.target === canvas.upperCanvasEl) {
            e.preventDefault();
          }
        };
        
        // Add event listeners with proper types
        canvas.wrapperEl.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.wrapperEl.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // Setup cleanup function
        removeListeners.push(
          () => canvas.wrapperEl?.removeEventListener('touchstart', handleTouchStart),
          () => canvas.wrapperEl?.removeEventListener('touchmove', handleTouchMove)
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
