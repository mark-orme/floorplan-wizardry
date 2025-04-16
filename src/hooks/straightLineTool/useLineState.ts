
import { useState, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { InputMethod } from './useLineInputMethod';
import { captureError } from '@/utils/sentryUtils';

// Re-export InputMethod so other modules can import it from here
export { InputMethod } from './useLineInputMethod';

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
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<Text | null>(null);
  
  // Snapping options
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  
  // Input method
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  // Add isPencilMode state
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Use snap to grid functionality
  const { snapPointToGrid } = useSnapToGrid({
    initialSnapEnabled: snapEnabled
  });
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Create a new line
  const createLine = useCallback((
    canvas: FabricCanvas | null,
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number,
    color: string,
    thickness: number
  ): Line | null => {
    if (!canvas) return null;
    
    try {
      const line = new Line([x1, y1, x2, y2], {
        stroke: color,
        strokeWidth: thickness,
        selectable: true,
        evented: true,
        objectType: 'straight-line'
      });
      
      canvas.add(line);
      return line;
    } catch (error) {
      console.error('Error creating line:', error);
      captureError(error as Error);
      return null;
    }
  }, []);
  
  // Create a distance tooltip
  const createDistanceTooltip = useCallback((
    canvas: FabricCanvas | null,
    x: number, 
    y: number, 
    distance: number
  ): Text | null => {
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
      captureError(error as Error);
      return null;
    }
  }, []);
  
  // Initialize the line tool
  const initializeTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    console.log('Initializing straight line tool');
    
    // Disable selection
    canvas.selection = false;
    
    // Set cursor
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    
    // Disable drawing mode
    canvas.isDrawingMode = false;
    
    setIsToolInitialized(true);
  }, [fabricCanvasRef]);
  
  // Start drawing a line
  const startDrawing = useCallback((point: Point) => {
    console.log('Starting line drawing at', point);
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    setStartPoint(snappedPoint);
    setIsDrawing(true);
  }, [snapPointToGrid, snapEnabled]);
  
  // Continue drawing the line
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !fabricCanvasRef.current) return;
    
    // Apply snapping if enabled
    let endPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Apply angle constraints if enabled
    if (anglesEnabled && startPoint) {
      // Calculate angle
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx);
      
      // Round to nearest 45 degrees
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      
      // Calculate distance
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate new end point
      endPoint = {
        x: startPoint.x + Math.cos(snapAngle) * distance,
        y: startPoint.y + Math.sin(snapAngle) * distance
      };
    }
    
    setCurrentPoint(endPoint);
    
    // Update or create line
    if (currentLine) {
      currentLine.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
    } else {
      const newLine = createLine(
        fabricCanvasRef.current, 
        startPoint.x, 
        startPoint.y, 
        endPoint.x, 
        endPoint.y,
        lineColor,
        lineThickness
      );
      setCurrentLine(newLine);
    }
    
    // Update or create distance tooltip
    if (startPoint) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const midX = (startPoint.x + endPoint.x) / 2;
      const midY = (startPoint.y + endPoint.y) / 2;
      
      if (distanceTooltip) {
        // Update existing tooltip
        const meters = (distance / 100).toFixed(1);
        distanceTooltip.set({
          text: `${meters}m`,
          left: midX,
          top: midY - 10
        });
      } else if (distance > 10) { // Only show tooltip for lines with some length
        const newTooltip = createDistanceTooltip(
          fabricCanvasRef.current,
          midX,
          midY,
          distance
        );
        setDistanceTooltip(newTooltip);
      }
    }
    
    // Render changes
    fabricCanvasRef.current.renderAll();
  }, [
    isDrawing, 
    startPoint, 
    fabricCanvasRef, 
    currentLine, 
    distanceTooltip, 
    snapEnabled, 
    anglesEnabled, 
    snapPointToGrid,
    createLine,
    createDistanceTooltip,
    lineColor,
    lineThickness
  ]);
  
  // Complete drawing the line
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !fabricCanvasRef.current) return;
    
    console.log('Completing line drawing at', point);
    
    // Apply final snapping if enabled
    let endPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Apply angle constraints if enabled
    if (anglesEnabled && startPoint) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx);
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      endPoint = {
        x: startPoint.x + Math.cos(snapAngle) * distance,
        y: startPoint.y + Math.sin(snapAngle) * distance
      };
    }
    
    // Remove the temporary line and tooltip
    if (currentLine) {
      fabricCanvasRef.current.remove(currentLine);
    }
    
    if (distanceTooltip) {
      fabricCanvasRef.current.remove(distanceTooltip);
    }
    
    // Create the final line
    const finalLine = createLine(
      fabricCanvasRef.current,
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
      lineColor,
      lineThickness
    );
    
    // Create the final tooltip
    if (finalLine) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) { // Only show tooltip for lines with some length
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;
        
        createDistanceTooltip(
          fabricCanvasRef.current,
          midX,
          midY,
          distance
        );
      }
    }
    
    // Save state for undo/redo
    saveCurrentState();
    
    // Reset drawing state
    resetDrawingState();
    
    // Render changes
    fabricCanvasRef.current.renderAll();
  }, [
    isDrawing, 
    startPoint, 
    fabricCanvasRef, 
    currentLine, 
    distanceTooltip, 
    snapEnabled, 
    anglesEnabled, 
    snapPointToGrid,
    createLine,
    createDistanceTooltip,
    saveCurrentState,
    lineColor,
    lineThickness
  ]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    console.log('Cancelling line drawing');
    
    // Remove temporary objects
    if (currentLine && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(currentLine);
    }
    
    if (distanceTooltip && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(distanceTooltip);
    }
    
    // Reset drawing state
    resetDrawingState();
    
    // Render changes
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
  }, [fabricCanvasRef, currentLine, distanceTooltip]);
  
  // Reset drawing state
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, []);
  
  return {
    // State
    isDrawing,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    snapEnabled,
    anglesEnabled,
    inputMethod,
    isPencilMode,
    
    // Methods
    initializeTool,
    createLine,
    createDistanceTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    setInputMethod,
    setIsPencilMode
  };
};
