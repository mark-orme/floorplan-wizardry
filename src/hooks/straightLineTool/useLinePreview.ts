
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';
import useLineAngleSnap from './useLineAngleSnap';

interface UseLinePreviewOptions {
  angleSnapEnabled?: boolean;
  angleSnapStep?: number;
  gridSnapEnabled?: boolean;
  gridSize?: number;
}

export const useLinePreview = ({
  angleSnapEnabled = false,
  angleSnapStep = 15,
  gridSnapEnabled = false,
  gridSize = 20,
}: UseLinePreviewOptions = {}) => {
  const [previewLine, setPreviewLine] = useState<{ start: Point | null; end: Point | null }>({
    start: null,
    end: null,
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize angle snap hook with options
  const angleSnap = useLineAngleSnap({
    enabled: angleSnapEnabled,
    angleStep: angleSnapStep,
  });
  
  // Start drawing from a point
  const startDrawing = useCallback((point: Point) => {
    setPreviewLine({
      start: point,
      end: point,
    });
    setIsDrawing(true);
    angleSnap.resetAngle();
  }, [angleSnap]);
  
  // Update end point while drawing
  const updateEndPoint = useCallback((point: Point) => {
    if (!isDrawing || !previewLine.start) return;
    
    let endPoint = point;
    
    // Apply angle snap if enabled
    if (angleSnap.isEnabled && previewLine.start) {
      const snapped = angleSnap.snapAngle(previewLine.start, point);
      endPoint = snapped.point;
    }
    
    // Apply grid snap if enabled
    if (gridSnapEnabled && gridSize > 0) {
      endPoint = {
        x: Math.round(endPoint.x / gridSize) * gridSize,
        y: Math.round(endPoint.y / gridSize) * gridSize,
      };
    }
    
    setPreviewLine(prev => ({
      ...prev,
      end: endPoint,
    }));
  }, [isDrawing, previewLine.start, angleSnap, gridSnapEnabled, gridSize]);
  
  // End drawing
  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    return previewLine;
  }, [previewLine]);
  
  // Reset the preview line
  const resetPreview = useCallback(() => {
    setPreviewLine({ start: null, end: null });
    setIsDrawing(false);
    angleSnap.resetAngle();
  }, [angleSnap]);
  
  // Toggle angle snapping
  const toggleAngleSnap = useCallback(() => {
    angleSnap.toggleEnabled();
  }, [angleSnap]);
  
  return {
    previewLine,
    isDrawing,
    startDrawing,
    updateEndPoint,
    endDrawing,
    resetPreview,
    toggleAngleSnap,
    angleSnapEnabled: angleSnap.isEnabled,
  };
};

export default useLinePreview;
