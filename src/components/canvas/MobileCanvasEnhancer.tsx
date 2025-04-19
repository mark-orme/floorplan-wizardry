
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';
import logger from '@/utils/logger';
import { captureMessage } from '@/utils/sentry';

interface MobileCanvasEnhancerProps {
  canvas: FabricCanvas | null;
}

/**
 * Component that enhances canvas functionality on mobile devices
 * Handles touch interactions and ensures grid visibility
 */
export const MobileCanvasEnhancer: React.FC<MobileCanvasEnhancerProps> = ({ canvas }) => {
  const isMobile = useIsMobile();
  const enhancementAppliedRef = useRef(false);
  const attemptRef = useRef(0);
  
  useEffect(() => {
    if (!canvas || !isMobile) return;
    
    logger.info("MobileCanvasEnhancer: Setting up mobile optimizations");
    
    // Apply mobile-specific optimizations
    const applyMobileOptimizations = () => {
      if (!canvas || enhancementAppliedRef.current) return;
      
      try {
        // Check if wrapper element is ready
        if (!canvas.wrapperEl) {
          attemptRef.current += 1;
          if (attemptRef.current < 5) {
            logger.info("Canvas wrapper element not ready yet, will retry");
            setTimeout(applyMobileOptimizations, 300); // Retry
          } else {
            logger.error("Canvas wrapper still not ready after multiple attempts");
            captureMessage('Canvas wrapper not ready after multiple attempts', 'mobile-optimization', {
              level: 'error',
              tags: { component: 'MobileCanvasEnhancer' }
            });
          }
          return;
        }
        
        logger.info("Applying mobile canvas optimizations");
        
        // Add mobile-specific classes
        canvas.wrapperEl.classList.add('mobile-canvas-wrapper');
        canvas.wrapperEl.style.touchAction = 'pan-x pan-y'; // Better touch handling
        
        // Optimize for touch
        if (canvas.upperCanvasEl) {
          canvas.upperCanvasEl.style.touchAction = 'none';
        }
        
        // Enable brush with better settings for mobile
        canvas.freeDrawingBrush.width = 3; // Thicker lines for touch
        canvas.freeDrawingBrush.color = '#000000';
        
        // Set up canvas for better mobile performance
        canvas.stopContextMenu = true; // Prevent context menu on long press
        canvas.enableRetinaScaling = false; // Better performance
        
        // Fix grid visibility
        ensureMobileGridVisibility(canvas);
        
        // Force render
        canvas.requestRenderAll();
        
        enhancementAppliedRef.current = true;
        logger.info("Mobile optimizations applied successfully");
        
        // Set up touch start event listener to ensure drawing mode works
        const touchStartHandler = () => {
          if (!canvas.isDrawingMode) return;
          
          // Make sure grid is visible and at back
          ensureMobileGridVisibility(canvas);
        };
        
        canvas.upperCanvasEl.addEventListener('touchstart', touchStartHandler);
        
        return () => {
          canvas.upperCanvasEl.removeEventListener('touchstart', touchStartHandler);
        };
      } catch (error) {
        logger.error("Error applying mobile optimizations:", error);
        captureMessage('Error during mobile canvas optimizations', 'mobile-optimization', {
          level: 'error',
          tags: { component: 'MobileCanvasEnhancer' },
          extra: { error: String(error) }
        });
      }
    };
    
    const ensureMobileGridVisibility = (canvas: FabricCanvas) => {
      // Check if grid exists
      const gridObjects = canvas.getObjects().filter(obj => 
        (obj as any).isGrid === true || (obj as any).objectType === 'grid'
      );
      
      logger.info(`Grid check: found ${gridObjects.length} grid objects after canvas ready`);
      
      if (gridObjects.length === 0) {
        logger.warn("No grid found on mobile, attempting to recreate");
        
        try {
          // Create grid with slightly larger spacing for mobile
          const mobileGridSize = 30; // Larger grid for mobile
          const newGridObjects = createSimpleGrid(canvas, mobileGridSize);
          
          logger.info(`Emergency grid creation added ${newGridObjects.length} objects`);
          canvas.requestRenderAll();
        } catch (gridError) {
          logger.error("Error creating mobile grid:", gridError);
        }
      } else {
        // Ensure all grid objects are visible and at the back
        let visibilityFixed = false;
        
        gridObjects.forEach(obj => {
          if (!obj.visible) {
            obj.set('visible', true);
            visibilityFixed = true;
          }
          
          // Ensure at back
          if (canvas.sendToBack) {
            canvas.sendToBack(obj);
          } else if (canvas.sendObjectToBack) {
            canvas.sendObjectToBack(obj);
          }
        });
        
        if (visibilityFixed) {
          logger.info("Fixed grid visibility on mobile");
          canvas.requestRenderAll();
        }
      }
    };
    
    // Start the optimization process
    applyMobileOptimizations();
    
    // Set up regular checks to ensure grid visibility
    const checkInterval = setInterval(() => {
      if (canvas) {
        ensureMobileGridVisibility(canvas);
      }
    }, 5000);
    
    return () => {
      clearInterval(checkInterval);
      if (canvas && canvas.wrapperEl) {
        canvas.wrapperEl.classList.remove('mobile-canvas-wrapper');
      }
    };
  }, [canvas, isMobile]);
  
  return null; // Non-visual component
};

export default MobileCanvasEnhancer;
