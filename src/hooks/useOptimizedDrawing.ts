
/**
 * Hook for optimized drawing with feedback
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { usePerformanceMonitoring } from './usePerformanceMonitoring';
import logger from '@/utils/logger';

interface UseOptimizedDrawingProps {
  canvas: FabricCanvas | null;
  currentTool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  enableOptimizations?: boolean;
}

export function useOptimizedDrawing({
  canvas,
  currentTool,
  lineThickness,
  lineColor,
  enableOptimizations = true
}: UseOptimizedDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const throttleTimerRef = useRef<number | null>(null);
  
  // Use performance monitoring
  const { startMonitoring, stopMonitoring, metrics } = usePerformanceMonitoring();
  
  // Initialize drawing settings
  useEffect(() => {
    if (!canvas) return;
    
    // Set up canvas for drawing
    canvas.isDrawingMode = currentTool === DrawingMode.PENCIL;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = lineThickness;
      canvas.freeDrawingBrush.color = lineColor;
    }
    
    // Update object count
    setObjectCount(canvas.getObjects().length);
    
    // Start performance monitoring
    if (enableOptimizations) {
      startMonitoring(canvas);
    }
    
    return () => {
      if (enableOptimizations) {
        stopMonitoring();
      }
    };
  }, [canvas, currentTool, lineThickness, lineColor, enableOptimizations, startMonitoring, stopMonitoring]);
  
  // Event handler for mouse down
  const handleMouseDown = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || currentTool !== DrawingMode.PENCIL) return;
    
    setIsDrawing(true);
    const pointer = canvas.getPointer(event);
    lastPositionRef.current = { x: pointer.x, y: pointer.y };
    
    // Start monitoring performance during drawing
    if (enableOptimizations) {
      startMonitoring(canvas);
    }
  }, [currentTool, enableOptimizations, startMonitoring]);
  
  // Event handler for mouse move
  const handleMouseMove = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || !isDrawing || currentTool !== DrawingMode.PENCIL) return;
    
    // Throttle drawing for better performance
    if (throttleTimerRef.current !== null) return;
    
    throttleTimerRef.current = window.setTimeout(() => {
      throttleTimerRef.current = null;
      
      const pointer = canvas.getPointer(event);
      const currentPosition = { x: pointer.x, y: pointer.y };
      
      // Draw line
      const line = new fabric.Line(
        [lastPositionRef.current.x, lastPositionRef.current.y, currentPosition.x, currentPosition.y],
        {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false,
          evented: false
        }
      );
      
      canvas.add(line);
      canvas.renderAll();
      
      // Update last position
      lastPositionRef.current = currentPosition;
      
      // Update object count occasionally
      if (Math.random() < 0.1) {
        setObjectCount(canvas.getObjects().length);
      }
    }, 10);
  }, [isDrawing, currentTool, lineColor, lineThickness]);
  
  // Event handler for mouse up
  const handleMouseUp = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || currentTool !== DrawingMode.PENCIL) return;
    
    setIsDrawing(false);
    
    // Stop performance monitoring
    if (enableOptimizations) {
      stopMonitoring();
    }
    
    // Clear throttle timer
    if (throttleTimerRef.current !== null) {
      clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
    
    // Update object count
    setObjectCount(canvas.getObjects().length);
    
    // Log drawing completion for debugging
    logger.debug(`Drawing complete with ${canvas.getObjects().length} objects`);
  }, [currentTool, enableOptimizations, stopMonitoring]);
  
  // Clean up throttle timer on unmount
  useEffect(() => {
    return () => {
      if (throttleTimerRef.current !== null) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);
  
  return {
    isDrawing,
    objectCount,
    metrics,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
