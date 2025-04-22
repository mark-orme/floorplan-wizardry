
import React, { useEffect } from 'react';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentryUtils';

/**
 * Canvas Drawing Enhancer Component
 * Enhances canvas with drawing capabilities by connecting drawing context to canvas
 */
interface CanvasDrawingEnhancerProps {
  children: React.ReactNode;
}

export const CanvasDrawingEnhancer: React.FC<CanvasDrawingEnhancerProps> = ({ children }) => {
  const { canvas, tool, lineColor, lineThickness, addToUndoStack } = useDrawingContext();
  
  // Update canvas drawing settings when relevant context values change
  useEffect(() => {
    if (!canvas) return;
    
    try {
      // Set drawing mode based on tool
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      if (canvas.isDrawingMode) {
        // Configure brush
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        
        // Save current state for undo history
        addToUndoStack(canvas.toJSON());
      }
      
      // Log drawing mode changes - fix to use only two parameters
      captureMessage('Drawing mode updated', { 
        context: 'canvas-drawing-enhancer',
        isDrawingMode: canvas.isDrawingMode 
      });
    } catch (err) {
      console.error('Error configuring drawing mode:', err);
    }
  }, [canvas, tool, lineColor, lineThickness, addToUndoStack]);
  
  return <>{children}</>;
};

export default CanvasDrawingEnhancer;
