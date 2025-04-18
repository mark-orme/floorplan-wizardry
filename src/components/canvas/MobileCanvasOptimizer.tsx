
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileCanvasOptimizerProps {
  canvas: FabricCanvas | null;
}

export const MobileCanvasOptimizer: React.FC<MobileCanvasOptimizerProps> = ({ canvas }) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!canvas) return;

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
        
        // Add mobile grid class for enhanced visibility
        canvas.wrapperEl.classList.add('mobile-grid');
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
      
      // Optimize for mobile performance
      canvas.renderOnAddRemove = false;
      canvas.skipTargetFind = false;
      canvas.stopContextMenu = true;
      
      // Set up pinch-to-zoom on mobile
      const hammer = new (window as any).Hammer(canvas.upperCanvasEl);
      hammer.get('pinch').set({ enable: true });
      
      hammer.on('pinch', (ev: any) => {
        const center = {
          x: ev.center.x,
          y: ev.center.y
        };
        
        const zoom = canvas.getZoom() * ev.scale;
        canvas.zoomToPoint(center, zoom);
      });
      
      // Ensure grid is visible
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if ((obj as any).isGrid || (obj as any).objectType === 'grid') {
          obj.set({
            opacity: 1,
            visible: true
          });
        }
      });
      
      // Refresh the canvas
      canvas.requestRenderAll();
    }
    
    return () => {
      if (canvas && canvas.wrapperEl) {
        canvas.wrapperEl.classList.remove('touch-optimized-canvas', 'ios-canvas', 'mobile-grid');
      }
      
      // Clean up Hammer if it was initialized
      if (isMobile && canvas.upperCanvasEl) {
        const hammer = (canvas.upperCanvasEl as any).__hammer;
        if (hammer) {
          hammer.destroy();
          delete (canvas.upperCanvasEl as any).__hammer;
        }
      }
    };
  }, [canvas, isMobile]);

  return null; // This is a non-visual component
};
