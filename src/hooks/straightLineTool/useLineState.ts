import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useGridSnapping } from '../useGridSnapping';

/**
 * Input method enum for device detection
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Props for useLineState hook
 */
interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing line drawing state
 */
export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  
  // Grid snapping hook
  const { snapPointToGrid, snapLineToGrid } = useGridSnapping();
  
  // Distance tooltip reference
  const tooltipRef = useRef<Text | null>(null);
  
  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    setStartPoint(snappedPoint);
    
    // Create initial line
    const line = new Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straight-line-temp'
      }
    );
    
    canvas.add(line);
    setCurrentLine(line);
    setIsDrawing(true);
    
    // Create distance tooltip
    const tooltip = new Text('0 px', {
      left: snappedPoint.x,
      top: snappedPoint.y - 10,
      fontSize: 12,
      fill: '#000000',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 2,
      selectable: false,
      originX: 'center',
      originY: 'bottom'
    });
    canvas.add(tooltip);
    tooltipRef.current = tooltip;
    
    canvas.renderAll();
  }, [fabricCanvasRef, lineColor, lineThickness, snapEnabled, snapPointToGrid]);

  /**
   * Continue drawing to a point
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update line
    currentLine.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    // Calculate distance for tooltip
    const dx = snappedPoint.x - startPoint.x;
    const dy = snappedPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Apply angle constraints if enabled
    if (anglesEnabled && distance > 20) {
      // Constrain to 0, 45, 90, 135, 180, 225, 270, 315 degrees
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const snappedAngle = Math.round(angle / 45) * 45;
      const snappedRadian = snappedAngle * Math.PI / 180;
      
      // Calculate new endpoint based on snapped angle
      const newX = startPoint.x + distance * Math.cos(snappedRadian);
      const newY = startPoint.y + distance * Math.sin(snappedRadian);
      
      currentLine.set({
        x2: newX,
        y2: newY
      });
    }
    
    // Update tooltip
    if (tooltipRef.current) {
      const midX = (startPoint.x + currentLine.x2!) / 2;
      const midY = (startPoint.y + currentLine.y2!) / 2 - 10;
      
      tooltipRef.current.set({
        text: `${Math.round(distance)} px`,
        left: midX,
        top: midY
      });
    }
    
    canvas.renderAll();
  }, [isDrawing, startPoint, currentLine, fabricCanvasRef, snapEnabled, snapPointToGrid, anglesEnabled]);

  /**
   * Complete drawing at a point
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Calculate distance
    const dx = snappedPoint.x - startPoint.x;
    const dy = snappedPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Apply angle constraints if enabled (same as in continueDrawing)
    if (anglesEnabled && distance > 20) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const snappedAngle = Math.round(angle / 45) * 45;
      const snappedRadian = snappedAngle * Math.PI / 180;
      
      const newX = startPoint.x + distance * Math.cos(snappedRadian);
      const newY = startPoint.y + distance * Math.sin(snappedRadian);
      
      currentLine.set({
        x2: newX,
        y2: newY
      });
    } else {
      // Update line endpoint
      currentLine.set({
        x2: snappedPoint.x,
        y2: snappedPoint.y
      });
    }
    
    // Only keep the line if it has a meaningful length
    if (distance > 5) {
      // Save current state for undo
      saveCurrentState();
      
      // Update line properties for final state
      currentLine.set({
        selectable: true,
        evented: true,
        objectType: 'straight-line'
      });
      
      // Keep tooltip if needed, or remove it
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
        tooltipRef.current = null;
      }
    } else {
      // Line too short, remove it
      canvas.remove(currentLine);
      
      // Remove tooltip
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
        tooltipRef.current = null;
      }
    }
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    
    canvas.renderAll();
  }, [isDrawing, startPoint, currentLine, fabricCanvasRef, snapEnabled, snapPointToGrid, anglesEnabled, saveCurrentState]);

  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove the line
    canvas.remove(currentLine);
    
    // Remove tooltip
    if (tooltipRef.current) {
      canvas.remove(tooltipRef.current);
      tooltipRef.current = null;
    }
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    
    canvas.renderAll();
  }, [isDrawing, currentLine, fabricCanvasRef]);

  /**
   * Toggle grid snapping
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
    startPoint,
    currentLine,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    setIsPencilMode,
    setInputMethod,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    toggleSnap,
    toggleAngles
  };
};
