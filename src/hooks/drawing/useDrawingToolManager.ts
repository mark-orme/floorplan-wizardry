import { useCallback, useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { useMouseEvents } from './useMouseEvents';

interface UseDrawingToolManagerProps {
  canvas: FabricCanvas | null;
  activeTool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  onCreateObject?: (obj: any) => void;
}

export const useDrawingToolManager = ({
  canvas,
  activeTool,
  lineColor,
  lineThickness,
  onCreateObject
}: UseDrawingToolManagerProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<any>(null);
  
  const createRectangle = useCallback((startPoint: Point, endPoint: Point) => {
    if (!canvas) return null;
    
    const left = Math.min(startPoint.x, endPoint.x);
    const top = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);
    
    const rect = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: 'transparent',
      stroke: lineColor || '#000000',
      strokeWidth: lineThickness || 2
    });
    
    return rect;
  }, [canvas, lineColor, lineThickness]);
  
  const createCircle = useCallback((startPoint: Point, endPoint: Point) => {
    if (!canvas) return null;
    
    const left = Math.min(startPoint.x, endPoint.x);
    const top = Math.min(startPoint.y, endPoint.y);
    const radius = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    ) / 2;
    
    const circle = new fabric.Circle({
      left: left + Math.abs(endPoint.x - startPoint.x) / 2 - radius,
      top: top + Math.abs(endPoint.y - startPoint.y) / 2 - radius,
      radius,
      fill: 'transparent',
      stroke: lineColor || '#000000',
      strokeWidth: lineThickness || 2
    });
    
    return circle;
  }, [canvas, lineColor, lineThickness]);
  
  const createLine = useCallback((startPoint: Point, endPoint: Point) => {
    if (!canvas) return null;
    
    const line = new fabric.Line(
      [startPoint.x, startPoint.y, endPoint.x, endPoint.y], 
      {
        stroke: lineColor || '#000000',
        strokeWidth: lineThickness || 2
      }
    );
    
    return line;
  }, [canvas, lineColor, lineThickness]);

  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || activeTool === DrawingMode.SELECT) return;
    
    // Set drawing flag
    const pointer = canvas.getPointer(e.e);
    const startPoint = { x: pointer.x, y: pointer.y };
    
    // Store start point
    setIsDrawing(true);
    
    switch (activeTool) {
      case DrawingMode.DRAW:
        // Canvas free drawing is handled by fabric directly
        // Just make sure the brush is configured
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        break;
      
      case DrawingMode.LINE:
        // Create a line
        const line = createLine(startPoint, startPoint);
        canvas.add(line);
        setCurrentPath(line);
        break;
      
      case DrawingMode.RECTANGLE:
        // Create a rectangle
        const rect = createRectangle(startPoint, startPoint);
        canvas.add(rect);
        setCurrentPath(rect);
        break;
      
      case DrawingMode.CIRCLE:
        // Create a circle
        const circle = createCircle(startPoint, startPoint);
        canvas.add(circle);
        setCurrentPath(circle);
        break;
      
      default:
        break;
    }
  }, [canvas, activeTool, lineColor, lineThickness]);
  
  const handleMouseMove = useCallback((point: Point) => {
    if (!canvas || !isDrawing || !currentPath) return;
    
    switch (activeTool) {
      case DrawingMode.LINE:
        // Update line end point
        currentPath.set({
          x2: point.x,
          y2: point.y
        });
        break;
      
      case DrawingMode.RECTANGLE:
        // Calculate width and height
        const width = Math.abs(point.x - currentPath.left);
        const height = Math.abs(point.y - currentPath.top);
        
        // Update rectangle dimensions
        currentPath.set({
          width,
          height
        });
        break;
      
      case DrawingMode.CIRCLE:
        // Calculate radius based on distance
        const dx = point.x - currentPath.left;
        const dy = point.y - currentPath.top;
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        // Update circle radius
        currentPath.set({
          radius
        });
        break;
        
      default:
        break;
    }
    
    canvas.renderAll();
  }, [canvas, isDrawing, currentPath, activeTool]);
  
  const handleMouseUp = useCallback(() => {
    if (!canvas || !isDrawing) return;
    
    // Make the object selectable again
    if (currentPath) {
      currentPath.set({
        selectable: true,
        evented: true
      });
      
      if (onCreateObject) {
        onCreateObject(currentPath);
      }
      
      canvas.setActiveObject(currentPath);
    }
    
    setIsDrawing(false);
    setCurrentPath(null);
  }, [canvas, isDrawing, currentPath, onCreateObject]);
  
  // Use the mouse events hook for handling interactions
  const fabricCanvasRef = { current: canvas };
  const mouseEvents = useMouseEvents({
    canvas,
    activeTool,
    isDrawing,
    setIsDrawing,
    onStartDrawing: handleMouseDown,
    onContinueDrawing: handleMouseMove,
    onEndDrawing: handleMouseUp
  });
  
  // Set up drawing mode based on the active tool
  useEffect(() => {
    if (!canvas) return;
    
    // Configure drawing mode
    canvas.isDrawingMode = activeTool === DrawingMode.DRAW;
    
    // Configure free drawing brush if we're in draw mode
    if (activeTool === DrawingMode.DRAW && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    // Configure object selection based on mode
    canvas.selection = activeTool === DrawingMode.SELECT;
    
    // Update canvas
    canvas.requestRenderAll();
  }, [canvas, activeTool, lineColor, lineThickness]);
  
  return {
    isDrawing,
    currentObject: currentPath,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

export default useDrawingToolManager;
