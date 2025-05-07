
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
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
  
  const handleMouseDown = useCallback((point: Point) => {
    if (!canvas || activeTool === DrawingMode.SELECT) return;
    
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
        const line = new fabric.Line([point.x, point.y, point.x, point.y], {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false
        });
        
        canvas.add(line);
        setCurrentPath(line);
        break;
      
      case DrawingMode.RECTANGLE:
        // Create a rectangle
        const rect = new fabric.Rect({
          left: point.x,
          top: point.y,
          width: 0,
          height: 0,
          stroke: lineColor,
          strokeWidth: lineThickness,
          fill: 'transparent',
          selectable: false
        });
        
        canvas.add(rect);
        setCurrentPath(rect);
        break;
      
      case DrawingMode.CIRCLE:
        // Create a circle
        const circle = new fabric.Circle({
          left: point.x,
          top: point.y,
          radius: 0,
          stroke: lineColor,
          strokeWidth: lineThickness,
          fill: 'transparent',
          selectable: false
        });
        
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
