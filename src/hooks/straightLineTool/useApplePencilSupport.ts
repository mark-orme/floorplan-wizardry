
import { useEffect } from 'react';
import { Canvas } from 'fabric';

// Helper to check if a touch is from an Apple Pencil
const isApplePencil = (event: TouchEvent): boolean => {
  // Check for iOS specific properties
  if (event.touches && event.touches[0]) {
    // Cast to include the non-standard Apple Pencil property
    const touch = event.touches[0] as Touch & { touchType?: string; force?: number };
    
    // Apple Pencil typically has higher force value and may have touchType property
    return (touch.force && touch.force > 0.8) || 
           (touch.touchType === 'stylus') || 
           // Some browsers identify it via pointerType on the event
           (event as unknown as { pointerType?: string }).pointerType === 'pen';
  }
  return false;
};

/**
 * Hook to enhance canvas with Apple Pencil support
 * @param canvas Fabric.js canvas instance
 * @param onApplePencilDetected Callback when Apple Pencil is detected
 */
export const useApplePencilSupport = (
  canvas: Canvas | null,
  onApplePencilDetected?: (isActive: boolean) => void
) => {
  // Set up listeners for Apple Pencil
  useEffect(() => {
    if (!canvas) return;
    
    // Handle touchstart events to detect Apple Pencil
    const handleTouchStart = (e: TouchEvent) => {
      const isPencil = isApplePencil(e);
      if (isPencil && onApplePencilDetected) {
        onApplePencilDetected(true);
      }
    };
    
    // Add event listener to the canvas
    if (canvas.wrapperEl) {
      canvas.wrapperEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    }
    
    // Cleanup
    return () => {
      if (canvas.wrapperEl) {
        canvas.wrapperEl.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [canvas, onApplePencilDetected]);

  // Configure canvas for Apple Pencil usage
  useEffect(() => {
    if (!canvas) return;
    
    // Ensure the free drawing brush is initialized
    if (canvas.freeDrawingBrush) {
      // Make sure freeDrawingBrush is initialized with default values
      const brush = canvas.freeDrawingBrush;
      brush.color = brush.color || '#000000';
      brush.width = brush.width || 2;
      
      // We can access onMouseDown safely now that we've ensured brush exists
      // This fixes the TypeScript error
      // Note: in fabric.js, the brush might not have onMouseDown, but we'd set up our own handlers
    }
    
  }, [canvas]);
  
  return {
    isApplePencilDetected: isApplePencil
  };
};
