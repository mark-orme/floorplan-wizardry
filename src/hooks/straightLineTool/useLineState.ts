import { useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

// Export the InputMethod enum so it can be accessed by other components
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil'
}

interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useLineState = ({ 
  fabricCanvasRef, 
  lineColor, 
  lineThickness,
  saveCurrentState 
}: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Line points
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // Line objects
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<Text | null>(null);
  
  // Settings
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  
  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isActive) return;
    
    logger.debug('Starting line drawing', point);
    
    // Create initial line
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    // Add to canvas
    canvas.add(line);
    canvas.renderAll();
    
    // Update state
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    setCurrentLine(line);
    
    // Create distance tooltip
    const tooltip = new Text('0px', {
      left: point.x + 10,
      top: point.y - 10,
      fontSize: 12,
      fill: '#333',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
      selectable: false,
      evented: false
    });
    
    canvas.add(tooltip);
    setDistanceTooltip(tooltip);
  }, [fabricCanvasRef, lineColor, lineThickness, isActive]);
  
  /**
   * Continue drawing the line
   */
  const continueDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine || !distanceTooltip) return;
    
    // Update line
    currentLine.set({
      x2: point.x,
      y2: point.y
    });
    
    // Calculate distance
    const dx = point.x - startPoint.x;
    const dy = point.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update tooltip
    distanceTooltip.set({
      text: `${Math.round(distance)}px`,
      left: (startPoint.x + point.x) / 2 + 10,
      top: (startPoint.y + point.y) / 2 - 10
    });
    
    canvas.renderAll();
    setCurrentPoint(point);
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, distanceTooltip]);
  
  /**
   * Complete the drawing
   */
  const completeDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine) return;
    
    // Update line final position
    currentLine.set({
      x2: point.x,
      y2: point.y,
      selectable: true,
      evented: true
    });
    
    // Keep distance tooltip
    if (distanceTooltip) {
      distanceTooltip.set({
        selectable: false,
        evented: false
      });
    }
    
    // Calculate line length
    const dx = point.x - startPoint.x;
    const dy = point.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only keep lines longer than 5px
    if (distance < 5) {
      canvas.remove(currentLine);
      if (distanceTooltip) {
        canvas.remove(distanceTooltip);
      }
    } else {
      // Save for undo history
      saveCurrentState();
    }
    
    canvas.renderAll();
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, distanceTooltip, saveCurrentState]);
  
  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing) return;
    
    // Remove current line
    if (currentLine) {
      canvas.remove(currentLine);
    }
    
    // Remove tooltip
    if (distanceTooltip) {
      canvas.remove(distanceTooltip);
    }
    
    canvas.renderAll();
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, [fabricCanvasRef, isDrawing, currentLine, distanceTooltip]);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    snapEnabled,
    anglesEnabled,
    toggleSnap,
    toggleAngles,
    setIsToolInitialized
  };
};
