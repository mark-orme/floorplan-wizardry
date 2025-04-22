
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface TouchGestureHandlerProps {
  canvas: FabricCanvas;
  lineThickness: number;
  tool: DrawingMode;
}

export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({
  canvas,
  lineThickness,
  tool
}) => {
  // This component doesn't render anything visible
  // It just attaches touch gesture handlers to the canvas
  
  React.useEffect(() => {
    if (!canvas) return;
    
    console.log('[TouchGestureHandler] Setting up touch handling');
    
    // Set up touch-action CSS property
    if (canvas.wrapperEl) {
      canvas.wrapperEl.style.touchAction = 
        tool === DrawingMode.PAN ? 'manipulation' : 'none';
    }
    
    // Clean up function
    return () => {
      console.log('[TouchGestureHandler] Cleaning up touch handlers');
    };
  }, [canvas, tool]);
  
  return null;
};
