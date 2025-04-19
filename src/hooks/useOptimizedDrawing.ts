
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { usePerformanceMonitoring } from './usePerformanceMonitoring';

// Add DrawingMode.PENCIL if it doesn't exist in the enum
// This is a temporary fix until the DrawingMode enum is updated
const ExtendedDrawingMode = {
  ...DrawingMode,
  PENCIL: 'PENCIL' as DrawingMode
};

export interface UseOptimizedDrawingProps {
  canvas: FabricCanvas | null;
  currentTool: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
  canvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

export function useOptimizedDrawing({
  canvas,
  currentTool,
  lineThickness = 2,
  lineColor = '#000000',
  canvasRef
}: UseOptimizedDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const drawingRef = useRef<{
    path?: FabricObject;
    points: { x: number; y: number }[];
  }>({ points: [] });
  
  const { metrics, startMonitoring, stopMonitoring } = usePerformanceMonitoring();
  
  // Set drawing mode based on current tool
  useEffect(() => {
    if (!canvas) return;
    
    // Enable drawing mode for free drawing tools
    canvas.isDrawingMode = currentTool === DrawingMode.DRAW || 
                           currentTool === ExtendedDrawingMode.PENCIL;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = lineThickness;
      canvas.freeDrawingBrush.color = lineColor;
    }
    
    // Start monitoring performance
    startMonitoring(canvas);
    
    return () => {
      stopMonitoring();
    };
  }, [canvas, currentTool, lineThickness, lineColor, startMonitoring, stopMonitoring]);
  
  // Track object count
  useEffect(() => {
    if (!canvas) return;
    
    const updateObjectCount = () => {
      setObjectCount(canvas.getObjects().length);
    };
    
    canvas.on('object:added', updateObjectCount);
    canvas.on('object:removed', updateObjectCount);
    canvas.on('canvas:cleared', updateObjectCount);
    
    updateObjectCount();
    
    return () => {
      canvas.off('object:added', updateObjectCount);
      canvas.off('object:removed', updateObjectCount);
      canvas.off('canvas:cleared', updateObjectCount);
    };
  }, [canvas]);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || currentTool !== ExtendedDrawingMode.PENCIL) return;
    
    setIsDrawing(true);
    drawingRef.current.points = [];
    
    const pointer = canvas.getPointer(event);
    drawingRef.current.points.push({ x: pointer.x, y: pointer.y });
    
    // Create a new path
    try {
      // Safely create a fabric.Path without direct reference
      // Using fabric namespace would cause an error, so we use canvas._objects as a workaround
      const fabricLib = (canvas as any).constructor;
      if (fabricLib && fabricLib.Path) {
        const path = new fabricLib.Path(`M ${pointer.x} ${pointer.y}`, {
          stroke: lineColor,
          strokeWidth: lineThickness,
          fill: '',
          strokeLineCap: 'round',
          strokeLineJoin: 'round'
        });
        
        drawingRef.current.path = path;
        canvas.add(path);
      }
    } catch (error) {
      console.error('Error creating path:', error);
    }
  }, [currentTool, lineColor, lineThickness]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || !isDrawing || currentTool !== ExtendedDrawingMode.PENCIL) return;
    
    const pointer = canvas.getPointer(event);
    drawingRef.current.points.push({ x: pointer.x, y: pointer.y });
    
    if (drawingRef.current.path) {
      const path = drawingRef.current.path as any;
      const points = drawingRef.current.points;
      
      // Build the path string
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathString += ` L ${points[i].x} ${points[i].y}`;
      }
      
      if (path.setPath) {
        path.setPath(pathString);
        canvas.requestRenderAll();
      }
    }
  }, [isDrawing, currentTool]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || !isDrawing || currentTool !== ExtendedDrawingMode.PENCIL) return;
    
    setIsDrawing(false);
    
    // Finalize the path
    if (drawingRef.current.path) {
      canvas.fire('object:modified', { target: drawingRef.current.path });
      drawingRef.current.path = undefined;
    }
    
    drawingRef.current.points = [];
  }, [isDrawing, currentTool]);
  
  return {
    isDrawing,
    objectCount,
    metrics,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
