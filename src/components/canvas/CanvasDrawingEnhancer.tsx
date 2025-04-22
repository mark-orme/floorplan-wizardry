
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { captureMessage } from '@/utils/sentryUtils';

interface CanvasDrawingEnhancerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
}

/**
 * CanvasDrawingEnhancer component
 * Enhances canvas drawing capabilities based on the selected tool
 */
export const CanvasDrawingEnhancer: React.FC<CanvasDrawingEnhancerProps> = ({
  canvas,
  tool
}) => {
  const [isDrawingMode, setIsDrawingMode] = useState(tool === DrawingMode.DRAW);
  const { addToHistory } = useDrawingContext();
  
  // Update drawing mode when tool changes
  useEffect(() => {
    if (!canvas) return;
    
    const newDrawingMode = tool === DrawingMode.DRAW;
    
    if (newDrawingMode !== isDrawingMode) {
      setIsDrawingMode(newDrawingMode);
      canvas.isDrawingMode = newDrawingMode;
      canvas.selection = tool === DrawingMode.SELECT;
      
      // Report to Sentry with new options format
      captureMessage("Drawing mode changed", {
        level: 'info',
        tags: { component: "CanvasDrawingEnhancer" },
        extra: { isDrawingMode }
      });
    }
  }, [canvas, tool, isDrawingMode]);
  
  // Save canvas state after each modification
  const handleObjectModified = useCallback(() => {
    if (addToHistory) {
      addToHistory();
    }
  }, [addToHistory]);
  
  useEffect(() => {
    if (!canvas) return;
    
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, handleObjectModified]);
  
  return null;
};

export default CanvasDrawingEnhancer;
