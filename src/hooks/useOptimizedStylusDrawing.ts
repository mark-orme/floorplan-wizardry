
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseOptimizedStylusDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isEnabled?: boolean;
  brushColor?: string;
  brushWidth?: number;
}

export const useOptimizedStylusDrawing = ({
  fabricCanvasRef,
  isEnabled = false,
  brushColor = '#000000',
  brushWidth = 2
}: UseOptimizedStylusDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  
  // Configure brush settings
  const configureBrush = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;
    
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;
  }, [fabricCanvasRef, brushColor, brushWidth]);
  
  // Handle stylus input with pressure sensitivity
  const handleStylusInput = useCallback((event: PointerEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const pressure = event.pressure || 1;
    const dynamicWidth = brushWidth * pressure;
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = dynamicWidth;
    }
  }, [fabricCanvasRef, isEnabled, brushWidth]);
  
  // Start drawing
  const startDrawing = useCallback((point: { x: number; y: number }) => {
    if (!isEnabled) return;
    
    setIsDrawing(true);
    lastPointRef.current = point;
  }, [isEnabled]);
  
  // Continue drawing
  const continueDrawing = useCallback((point: { x: number; y: number }) => {
    if (!isDrawing || !lastPointRef.current) return;
    
    // Update last point
    lastPointRef.current = point;
  }, [isDrawing]);
  
  // End drawing
  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const canvasElement = canvas.upperCanvasEl;
    if (!canvasElement) return;
    
    canvasElement.addEventListener('pointermove', handleStylusInput);
    
    return () => {
      canvasElement.removeEventListener('pointermove', handleStylusInput);
    };
  }, [fabricCanvasRef, isEnabled, handleStylusInput]);
  
  // Configure brush when settings change
  useEffect(() => {
    configureBrush();
  }, [configureBrush]);
  
  return {
    isDrawing,
    startDrawing,
    continueDrawing,
    endDrawing,
    configureBrush
  };
};
