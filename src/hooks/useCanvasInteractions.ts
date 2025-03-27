/**
 * Hook for handling canvas drawing interactions
 * Manages mouse/touch interactions for drawing operations
 * @module useCanvasInteractions
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { DrawingState, Point } from '@/types/drawingTypes';
import { DrawingTool } from './useCanvasState';
import { useSnapToGrid } from './useSnapToGrid';
import { getNearestGridPoint } from '@/utils/gridUtils';
import { applyAngleQuantization } from '@/utils/geometry/straightening';
import { GRID_SPACING } from '@/constants/numerics';

interface UseCanvasInteractionsProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Line thickness for drawing */
  lineThickness?: number;
  /** Line color for drawing */
  lineColor?: string;
}

/**
 * Hook for handling canvas drawing interactions
 * Provides mouse/touch event handlers and drawing state
 * 
 * @param {UseCanvasInteractionsProps} props - Hook properties
 * @returns Drawing state and event handlers
 */
export const useCanvasInteractions = ({
  fabricCanvasRef,
  tool,
  lineThickness = 2,
  lineColor = '#000000'
}: UseCanvasInteractionsProps) => {
  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1
  });
  
  // Track original point before snapping
  const originalPointRef = useRef<Point | null>(null);
  
  // Get snap functionality from useSnapToGrid hook
  const {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    isAutoStraightened
  } = useSnapToGrid();
  
  // Update cursor position without starting drawing
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Get pointer position from Fabric canvas
      const canvas = fabricCanvasRef.current;
      const pointer = canvas.getPointer(e as any);
      
      // Store original point before any snapping
      originalPointRef.current = { x: pointer.x, y: pointer.y };
      
      // Apply grid snapping based on current tool
      let cursorPosition: Point = { x: pointer.x, y: pointer.y };
      if (['straightLine', 'wall', 'room'].includes(tool) && snapEnabled) {
        cursorPosition = getNearestGridPoint(cursorPosition, GRID_SPACING);
      }
      
      // If drawing, calculate mid point and update current point
      if (drawingState.isDrawing && drawingState.startPoint) {
        let currentPoint = cursorPosition;
        
        // Apply straightening for straight line and wall tools
        if (['straightLine', 'wall'].includes(tool) && snapEnabled) {
          currentPoint = applyAngleQuantization(drawingState.startPoint, currentPoint);
        }
        
        // Calculate midpoint for tooltip
        const midPoint = {
          x: (drawingState.startPoint.x + currentPoint.x) / 2,
          y: (drawingState.startPoint.y + currentPoint.y) / 2
        };
        
        setDrawingState(prev => ({
          ...prev,
          currentPoint,
          midPoint,
          cursorPosition
        }));
      } else {
        // Just update cursor position if not drawing
        setDrawingState(prev => ({
          ...prev,
          cursorPosition
        }));
      }
    } catch (error) {
      console.error("Error in handleMouseMove:", error);
    }
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint, tool, snapEnabled]);
  
  // Start drawing on mouse down
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Only process if we're using a drawing tool
    if (!['draw', 'straightLine', 'wall', 'room'].includes(tool)) return;
    
    try {
      // Get pointer position from Fabric canvas
      const canvas = fabricCanvasRef.current;
      const pointer = canvas.getPointer(e as any);
      
      // Apply grid snapping based on current tool
      let startPoint: Point = { x: pointer.x, y: pointer.y };
      
      // Store original point before any snapping
      originalPointRef.current = { x: pointer.x, y: pointer.y };
      
      if (['straightLine', 'wall', 'room'].includes(tool) && snapEnabled) {
        startPoint = getNearestGridPoint(startPoint, GRID_SPACING);
      }
      
      // Start drawing process
      setDrawingState(prev => ({
        ...prev,
        isDrawing: true,
        startPoint,
        currentPoint: startPoint,
        midPoint: null
      }));
      
      // Create a visual element based on tool
      if (tool === 'straightLine' || tool === 'wall') {
        // Will be handled in MouseMove and MouseUp
      } else if (tool === 'draw') {
        // Drawing mode is handled by fabric's builtin functionality
        canvas.isDrawingMode = true;
        
        // Make sure brush is properly configured
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
      }
    } catch (error) {
      console.error("Error in handleMouseDown:", error);
    }
  }, [fabricCanvasRef, tool, snapEnabled, lineColor, lineThickness]);
  
  // Finish drawing on mouse up
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Only complete drawing if we have a start and current point
      if (drawingState.startPoint && drawingState.currentPoint) {
        const startPoint = drawingState.startPoint;
        let endPoint = drawingState.currentPoint;
        
        // Apply final straightening for straight lines and walls
        if (['straightLine', 'wall'].includes(tool) && snapEnabled) {
          endPoint = applyAngleQuantization(startPoint, endPoint);
          
          // Create the line on the canvas
          const line = new Line(
            [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
            {
              stroke: lineColor,
              strokeWidth: lineThickness,
              selectable: true,
              objectType: tool
            }
          );
          
          canvas.add(line);
          canvas.renderAll();
          
          // Trigger a state save for undo/redo
          if (canvas.fire) {
            canvas.fire('object:modified', { target: line });
          }
        }
      }
      
      // Reset drawing state
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        midPoint: null
      }));
      
      // Disable drawing mode
      if (tool === 'draw') {
        canvas.isDrawingMode = false;
      }
    } catch (error) {
      console.error("Error in handleMouseUp:", error);
    }
  }, [fabricCanvasRef, drawingState, tool, snapEnabled, lineColor, lineThickness]);
  
  // Update when canvas zoom changes
  const updateZoomLevel = useCallback((zoom: number) => {
    setDrawingState(prev => ({
      ...prev,
      currentZoom: zoom
    }));
  }, []);
  
  // Calculate whether current point is snapped to grid
  const isSnappedToGrid = useCallback(() => {
    if (!drawingState.currentPoint || !originalPointRef.current) return false;
    
    return isSnappedToGrid(drawingState.currentPoint, originalPointRef.current);
  }, [drawingState.currentPoint, isSnappedToGrid]);
  
  // Calculate whether current line is straightened
  const isLineAutoStraightened = useCallback(() => {
    if (!drawingState.startPoint || !drawingState.currentPoint || !originalPointRef.current) {
      return false;
    }
    
    return isAutoStraightened(
      drawingState.startPoint,
      drawingState.currentPoint,
      originalPointRef.current
    );
  }, [drawingState.startPoint, drawingState.currentPoint, isAutoStraightened]);
  
  // Update brush settings when tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Enable drawing mode for freehand drawing tool
    if (tool === 'draw') {
      canvas.isDrawingMode = true;
      
      // Configure brush settings
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    } else {
      canvas.isDrawingMode = false;
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  // Cleanup function
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        // Disable drawing mode on cleanup
        fabricCanvasRef.current.isDrawingMode = false;
      }
    };
  }, [fabricCanvasRef]);
  
  return {
    drawingState,
    currentZoom: drawingState.currentZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    updateZoomLevel,
    toggleSnap,
    snapEnabled,
    isSnappedToGrid,
    isLineAutoStraightened
  };
};
