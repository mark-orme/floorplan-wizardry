import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

interface UseDrawingToolManagerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  activeTool: DrawingMode;
  onToolChange?: (tool: DrawingMode) => void;
}

// Extended UseMouseEventsProps with needed properties
interface UseMouseEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool?: DrawingMode;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  onMouseDown?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseUp?: (e: any) => void;
}

export const useDrawingToolManager = ({
  fabricCanvasRef,
  activeTool,
  onToolChange
}: UseDrawingToolManagerProps) => {
  const [previousTool, setPreviousTool] = useState<DrawingMode>(activeTool);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [drawingObjects, setDrawingObjects] = useState<any[]>([]);
  
  // Track tool changes
  useEffect(() => {
    if (activeTool !== previousTool) {
      // Clean up previous tool
      cleanupCurrentTool();
      
      // Initialize new tool
      initializeTool(activeTool);
      
      // Update previous tool
      setPreviousTool(activeTool);
      
      // Notify parent of tool change
      if (onToolChange) {
        onToolChange(activeTool);
      }
    }
  }, [activeTool, previousTool, onToolChange]);
  
  // Clean up current tool
  const cleanupCurrentTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    
    // Remove temporary drawing objects
    drawingObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    setDrawingObjects([]);
    
    // Reset canvas state based on previous tool
    switch (previousTool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = false;
        break;
      case DrawingMode.SELECT:
        canvas.selection = false;
        break;
      default:
        break;
    }
    
    // Reset cursor
    canvas.defaultCursor = 'default';
  }, [fabricCanvasRef, previousTool, drawingObjects]);
  
  // Initialize tool
  const initializeTool = useCallback((tool: DrawingMode) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Set canvas state based on tool
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case DrawingMode.LINE:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.RECTANGLE:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.CIRCLE:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.ERASER:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'cell';
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
    }
  }, [fabricCanvasRef]);
  
  // Get pointer position from event
  const getPointerPosition = useCallback((event: any): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.getPointer) return null;
    
    return canvas.getPointer(event);
  }, [fabricCanvasRef]);

  const pointerUtils = {
    getPointerPosition,
    lastPoint: null,
    handleMouseDown: (e: any) => {
      const point = getPointerPosition(e);
      if (!point) return;
      
      setIsDrawing(true);
      setStartPoint(point);
      setCurrentPoint(point);
      
      // Tool-specific handling
      handleToolMouseDown(activeTool, point);
    },
    handleMouseMove: (e: any) => {
      const point = getPointerPosition(e);
      if (!isDrawing || !point) return;
      
      setCurrentPoint(point);
      
      // Tool-specific handling
      handleToolMouseMove(activeTool, point);
    },
    handleMouseUp: (e: any) => {
      if (!isDrawing) return;
      
      const point = getPointerPosition(e);
      
      // Tool-specific handling
      handleToolMouseUp(activeTool, point || currentPoint);
      
      setIsDrawing(false);
    }
  };
  
  // Tool-specific mouse down handler
  const handleToolMouseDown = useCallback((tool: DrawingMode, point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    switch (tool) {
      case DrawingMode.LINE:
        // Start drawing a line
        break;
      case DrawingMode.RECTANGLE:
        // Start drawing a rectangle
        break;
      case DrawingMode.CIRCLE:
        // Start drawing a circle
        break;
      default:
        break;
    }
  }, [fabricCanvasRef]);
  
  // Tool-specific mouse move handler
  const handleToolMouseMove = useCallback((tool: DrawingMode, point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !startPoint) return;
    
    switch (tool) {
      case DrawingMode.LINE:
        // Update line
        break;
      case DrawingMode.RECTANGLE:
        // Update rectangle
        break;
      case DrawingMode.CIRCLE:
        // Update circle
        break;
      default:
        break;
    }
  }, [fabricCanvasRef, startPoint]);
  
  // Tool-specific mouse up handler
  const handleToolMouseUp = useCallback((tool: DrawingMode, point: Point | null) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !startPoint || !point) return;
    
    switch (tool) {
      case DrawingMode.LINE:
        // Finalize line
        break;
      case DrawingMode.RECTANGLE:
        // Finalize rectangle
        break;
      case DrawingMode.CIRCLE:
        // Finalize circle
        break;
      default:
        break;
    }
    
    // Clear temporary drawing objects
    setDrawingObjects([]);
  }, [fabricCanvasRef, startPoint]);
  
  useEffect(() => {
    // Register event handlers
    const mouseEvents: UseMouseEventsProps = {
      fabricCanvasRef,
      tool: activeTool,
      handleMouseDown: pointerUtils.handleMouseDown,
      handleMouseMove: pointerUtils.handleMouseMove,
      handleMouseUp: pointerUtils.handleMouseUp
    };
    
    // Initialize tool on mount
    initializeTool(activeTool);
    
    // Clean up on unmount
    return () => {
      cleanupCurrentTool();
    };
  }, [activeTool, fabricCanvasRef, initializeTool, cleanupCurrentTool]);
  
  return {
    activeTool,
    isDrawing,
    startPoint,
    currentPoint,
    setActiveTool: onToolChange,
    getPointerPosition
  };
};
