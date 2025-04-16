
import { useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineInputMethod, InputMethod } from './useLineInputMethod';

// Re-export InputMethod for convenience
export { InputMethod } from './useLineInputMethod';

interface UseLineStateProps {
  fabricCanvasRef: { current: FabricCanvas | null };
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing the state of the straight line tool
 */
export const useLineState = ({ 
  fabricCanvasRef, 
  lineColor, 
  lineThickness,
  saveCurrentState
}: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  // Points for line drawing
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // Grid snapping state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  
  // Line and tooltip references
  const [currentLine, setCurrentLine] = useState<any>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<any>(null);
  
  // Import and initialize input method state
  const { 
    inputMethod, 
    isPencilMode, 
    detectInputMethod,
    setInputMethod, 
    setIsPencilMode 
  } = useLineInputMethod();
  
  /**
   * Initialize the straight line tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    setIsActive(true);
  }, []);
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
    setIsActive(false);
  }, []);
  
  /**
   * Create a line on the canvas
   */
  const createLine = useCallback((start: Point, end: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    const line = new Line([start.x, start.y, end.x, end.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  /**
   * Create a distance tooltip on the canvas
   */
  const createDistanceTooltip = useCallback((midpoint: Point, distance: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    const text = new Text(`${Math.round(distance)}px`, {
      left: midpoint.x,
      top: midpoint.y,
      fontSize: 14,
      fill: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 4,
      selectable: false
    });
    
    canvas.add(text);
    canvas.renderAll();
    
    return text;
  }, [fabricCanvasRef]);
  
  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
  }, []);
  
  /**
   * Continue drawing a line
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    setCurrentPoint(point);
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // If no line exists yet, create one
    if (!currentLine) {
      const newLine = createLine(startPoint, point);
      setCurrentLine(newLine);
    } else {
      // Update existing line
      currentLine.set({ x2: point.x, y2: point.y });
      canvas.renderAll();
    }
    
    // Calculate distance for tooltip
    const distance = Math.sqrt(
      Math.pow(point.x - startPoint.x, 2) + 
      Math.pow(point.y - startPoint.y, 2)
    );
    
    // Calculate midpoint
    const midpoint = {
      x: (startPoint.x + point.x) / 2,
      y: (startPoint.y + point.y) / 2
    };
    
    // Update or create distance tooltip
    if (!distanceTooltip) {
      const newTooltip = createDistanceTooltip(midpoint, distance);
      setDistanceTooltip(newTooltip);
    } else {
      distanceTooltip.set({
        text: `${Math.round(distance)}px`,
        left: midpoint.x,
        top: midpoint.y
      });
      canvas.renderAll();
    }
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    distanceTooltip, 
    fabricCanvasRef, 
    createLine, 
    createDistanceTooltip
  ]);
  
  /**
   * Complete drawing a line
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Final update to the line
    if (currentLine) {
      currentLine.set({ x2: point.x, y2: point.y });
      canvas.renderAll();
    }
    
    // Save the current state for undo/redo
    saveCurrentState();
    
    // Reset drawing state while keeping the line
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, [
    isDrawing,
    startPoint,
    currentLine,
    fabricCanvasRef,
    saveCurrentState
  ]);
  
  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove the current line and tooltip
    if (currentLine) {
      canvas.remove(currentLine);
    }
    
    if (distanceTooltip) {
      canvas.remove(distanceTooltip);
    }
    
    canvas.renderAll();
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, [
    isDrawing,
    currentLine,
    distanceTooltip,
    fabricCanvasRef
  ]);
  
  /**
   * Toggle grid snapping
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prevSnap => !prevSnap);
  }, []);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prevAngles => !prevAngles);
  }, []);
  
  return {
    isDrawing,
    isToolInitialized,
    isActive,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    initializeTool,
    createLine,
    createDistanceTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    resetDrawingState,
    snapEnabled,
    anglesEnabled,
    toggleSnap,
    toggleAngles,
    inputMethod,
    isPencilMode,
    setInputMethod,
    setIsPencilMode,
    // Expose these properties for the preview hook
    lineColor,
    lineThickness,
    fabricCanvasRef
  };
};
