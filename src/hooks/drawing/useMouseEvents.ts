import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentryUtils';

interface UseMouseEventsProps {
  canvas: FabricCanvas | null;
  activeTool: DrawingMode;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  onStartDrawing?: (point: Point) => void;
  onContinueDrawing?: (point: Point) => void;
  onEndDrawing?: () => void;
  disabled?: boolean;
}

export const useMouseEvents = ({
  canvas,
  activeTool,
  isDrawing,
  setIsDrawing,
  onStartDrawing,
  onContinueDrawing,
  onEndDrawing,
  disabled = false
}: UseMouseEventsProps) => {
  const lastPointRef = useRef<Point | null>(null);
  
  const getPointerPosition = useCallback((event: any): Point | null => {
    if (!canvas) return null;
    
    try {
      const pointer = canvas.getPointer(event.e);
      return { x: pointer.x, y: pointer.y };
    } catch (err) {
      console.error('Error getting pointer position:', err);
      return null;
    }
  }, [canvas]);
  
  const handleMouseDown = useCallback((event: any) => {
    if (disabled || !canvas || activeTool === DrawingMode.SELECT) return;
    
    // Get pointer position
    const point = getPointerPosition(event);
    if (!point) return;
    
    // Start drawing
    setIsDrawing(true);
    lastPointRef.current = point;
    
    if (onStartDrawing) {
      onStartDrawing(point);
    }
  }, [canvas, activeTool, disabled, getPointerPosition, setIsDrawing, onStartDrawing]);
  
  const handleMouseMove = useCallback((event: any) => {
    if (!canvas || !isDrawing || disabled) return;
    
    // Get pointer position
    const point = getPointerPosition(event);
    if (!point) return;
    
    // Continue drawing
    if (onContinueDrawing) {
      onContinueDrawing(point);
    }
    
    lastPointRef.current = point;
  }, [canvas, isDrawing, disabled, getPointerPosition, onContinueDrawing]);
  
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || disabled) return;
    
    // End drawing
    setIsDrawing(false);
    
    if (onEndDrawing) {
      onEndDrawing();
    }
    
    lastPointRef.current = null;
    
    // Log drawing completion for analytics
    captureMessage('Drawing completed', {
      level: 'info',
      tags: { 
        tool: activeTool,
        component: 'Canvas' 
      }
    });
  }, [isDrawing, disabled, setIsDrawing, onEndDrawing, activeTool]);
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Clean up event listeners
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    getPointerPosition,
    lastPoint: lastPointRef.current
  };
};

export default useMouseEvents;
