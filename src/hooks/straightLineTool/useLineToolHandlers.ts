
/**
 * Hook for managing straight line tool event handlers
 * @module hooks/straightLineTool/useLineToolHandlers
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { InputMethod } from './useLineState';

interface UseLineToolHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isActive: boolean;
  isDrawing: boolean;
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<any | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  setStartPoint: (point: Point | null) => void;
  setCurrentLine: (line: Line | null) => void;
  resetDrawingState: () => void;
  saveCurrentState?: () => void;
  onChange?: (canvas: FabricCanvas) => void;
  lineColor: string;
  lineThickness: number;
  snapToAngle: boolean;
  snapAngleDeg: number;
  snapEnabled: boolean;
  snapLineToGrid: (line: Line) => void;
  inputMethod: InputMethod;
  logDrawingEvent: (message: string, eventId: string, data?: any) => void;
}

/**
 * Hook that provides pointer event handling functions for the line tool
 */
export const useLineToolHandlers = ({
  fabricCanvasRef,
  isActive,
  isDrawing,
  startPointRef,
  currentLineRef,
  distanceTooltipRef,
  setIsDrawing,
  setStartPoint,
  setCurrentLine,
  resetDrawingState,
  saveCurrentState,
  onChange,
  lineColor,
  lineThickness,
  snapToAngle,
  snapAngleDeg,
  snapEnabled,
  snapLineToGrid,
  inputMethod,
  logDrawingEvent
}: UseLineToolHandlersProps) => {
  // Get the error reporting hook
  const { reportDrawingError } = useDrawingErrorReporting();

  // Event handler for pointer down
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    try {
      // Store starting point
      setStartPoint(point);
      
      // Create temporary line
      const canvas = fabricCanvasRef.current;
      const line = new Line(
        [point.x, point.y, point.x, point.y],
        {
          strokeWidth: lineThickness,
          stroke: lineColor,
          selectable: false,
          evented: false,
          strokeLineCap: 'round',
          strokeLineJoin: 'round'
        }
      );
      
      // Add to canvas
      canvas.add(line);
      setCurrentLine(line);
      
      // Set drawing state
      setIsDrawing(true);
      
      // Log event
      logDrawingEvent('Line drawing started', 'line-start', {
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
    } catch (error) {
      reportDrawingError(error, 'line-pointer-down', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isActive, 
    setStartPoint, 
    lineThickness, 
    lineColor, 
    setCurrentLine, 
    setIsDrawing, 
    logDrawingEvent, 
    reportDrawingError,
    inputMethod
  ]);

  // Event handler for pointer move
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      // Get current pointer position and start point
      const startPoint = startPointRef.current;
      
      // Update line end point
      currentLineRef.current.set({
        x2: point.x,
        y2: point.y
      });
      
      // Apply angle snapping if enabled
      if (snapToAngle) {
        const angle = Math.atan2(point.y - startPoint.y, point.x - startPoint.x) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) + 
          Math.pow(point.y - startPoint.y, 2)
        );
        
        // Calculate new endpoint based on snapped angle
        const radians = snappedAngle * (Math.PI / 180);
        currentLineRef.current.set({
          x2: startPoint.x + distance * Math.cos(radians),
          y2: startPoint.y + distance * Math.sin(radians)
        });
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled && currentLineRef.current) {
        snapLineToGrid(currentLineRef.current);
      }
      
      // Render changes
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      reportDrawingError(error, 'line-pointer-move', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    snapToAngle, 
    snapAngleDeg, 
    snapEnabled, 
    snapLineToGrid,
    reportDrawingError,
    inputMethod
  ]);

  // Event handler for pointer up
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current) return;
    
    try {
      // Update the endpoint one last time
      handlePointerMove(point);
      
      // Finalize the line
      currentLineRef.current.set({
        selectable: true,
        evented: true
      });
      
      // Add metadata for identification
      currentLineRef.current.set('objectType', 'straightLine');
      
      // Reset state
      setIsDrawing(false);
      
      // Save state for undo/redo
      if (saveCurrentState) {
        saveCurrentState();
      }
      
      // Trigger canvas update
      fabricCanvasRef.current.renderAll();
      
      // Optionally trigger change event
      if (onChange) {
        onChange(fabricCanvasRef.current);
      }
      
      // Reset drawing state
      resetDrawingState();
      
      // Log event
      logDrawingEvent('Line drawing completed', 'line-complete', {
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
      
      setStartPoint(null);
      
    } catch (error) {
      reportDrawingError(error, 'line-pointer-up', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    handlePointerMove, 
    setIsDrawing, 
    saveCurrentState, 
    onChange, 
    resetDrawingState, 
    logDrawingEvent, 
    setStartPoint,
    reportDrawingError,
    inputMethod
  ]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
