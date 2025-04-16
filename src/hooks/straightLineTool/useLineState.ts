
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '../useSnapToGrid';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil'
}

interface UseLineStateProps {
  fabricCanvasRef: { current: FabricCanvas | null };
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
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<Text | null>(null);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Grid snapping state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  
  // Use the snap to grid hook
  const { snapPointToGrid } = useSnapToGrid({
    initialSnapEnabled: snapEnabled
  });
  
  // Initialize the tool
  const initializeTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.isDrawingMode = false;
    
    setIsToolInitialized(true);
  }, [fabricCanvasRef]);
  
  // Reset drawing state
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, []);
  
  // Create a line
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      const line = new Line([x1, y1, x2, y2], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        evented: true,
        objectType: 'straight-line'
      });
      
      canvas.add(line);
      return line;
    } catch (error) {
      console.error('Error creating line:', error);
      return null;
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  // Create a distance tooltip
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      // Convert distance to meters (assuming 100px = 1m)
      const meters = (distance / 100).toFixed(1);
      
      const tooltip = new Text(`${meters}m`, {
        left: x,
        top: y - 10,  // Position above the line
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        selectable: false,
        evented: false,
        objectType: 'measurement'
      });
      
      canvas.add(tooltip);
      return tooltip;
    } catch (error) {
      console.error('Error creating tooltip:', error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Start drawing
  const startDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    setIsDrawing(true);
    setIsActive(true);
    setStartPoint(snappedPoint);
    
    // Create the initial line
    const line = createLine(
      snappedPoint.x, 
      snappedPoint.y,
      snappedPoint.x,
      snappedPoint.y
    );
    
    setCurrentLine(line);
    
    // Create initial tooltip (0m distance)
    const tooltip = createDistanceTooltip(snappedPoint.x, snappedPoint.y, 0);
    setDistanceTooltip(tooltip);
    
    canvas.renderAll();
  }, [fabricCanvasRef, snapEnabled, snapPointToGrid, createLine, createDistanceTooltip]);
  
  // Continue drawing
  const continueDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update the current point
    setCurrentPoint(snappedPoint);
    
    // Update the line
    currentLine.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    // Calculate distance
    const dx = snappedPoint.x - startPoint.x;
    const dy = snappedPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update the tooltip
    if (distanceTooltip) {
      // Position the tooltip at the midpoint of the line
      const midX = (startPoint.x + snappedPoint.x) / 2;
      const midY = (startPoint.y + snappedPoint.y) / 2 - 10;
      
      // Convert distance to meters (assuming 100px = 1m)
      const meters = (distance / 100).toFixed(1);
      
      distanceTooltip.set({
        text: `${meters}m`,
        left: midX,
        top: midY
      });
    }
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, distanceTooltip, snapEnabled, snapPointToGrid]);
  
  // Complete drawing
  const completeDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update the line's final position
    currentLine.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y,
      selectable: true,
      evented: true
    });
    
    // Calculate the distance
    const dx = snappedPoint.x - startPoint.x;
    const dy = snappedPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If the line is too short, remove it
    if (distance < 5) {
      canvas.remove(currentLine);
      if (distanceTooltip) canvas.remove(distanceTooltip);
    } else {
      // Save current state for undo
      saveCurrentState();
      
      // Update the tooltip's final position
      if (distanceTooltip) {
        const midX = (startPoint.x + snappedPoint.x) / 2;
        const midY = (startPoint.y + snappedPoint.y) / 2 - 10;
        
        // Convert distance to meters (assuming 100px = 1m)
        const meters = (distance / 100).toFixed(1);
        
        distanceTooltip.set({
          text: `${meters}m`,
          left: midX,
          top: midY,
          selectable: false,
          evented: true
        });
      }
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, startPoint, currentLine, distanceTooltip, snapEnabled, snapPointToGrid, saveCurrentState]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentLine) return;
    
    // Remove the current line and tooltip
    canvas.remove(currentLine);
    if (distanceTooltip) canvas.remove(distanceTooltip);
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
    
    canvas.renderAll();
  }, [fabricCanvasRef, currentLine, distanceTooltip]);
  
  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    initializeTool,
    resetDrawingState,
    setInputMethod,
    setIsPencilMode,
    toggleSnap,
    toggleAngles,
    createLine,
    createDistanceTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};
