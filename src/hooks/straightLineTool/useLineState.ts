
import { useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Point, Text } from 'fabric';
import { captureError } from '@/utils/sentryUtils';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

export interface LinePoint {
  x: number;
  y: number;
}

// Add InputMethod enum and export it
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Hook for managing straight line state
 */
export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  
  // Get snap to grid functionality
  const { snapPointToGrid } = useSnapToGrid();
  
  // References to current drawing objects
  const startPointRef = useRef<LinePoint | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // State setters for current drawing objects
  const setStartPoint = useCallback((point: LinePoint | null) => {
    startPointRef.current = point;
  }, []);
  
  const setCurrentLine = useCallback((line: Line | null) => {
    currentLineRef.current = line;
  }, []);
  
  const setDistanceTooltip = useCallback((tooltip: Text | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Create a new line
   */
  const createLine = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    try {
      // Create line with proper object type for identification
      return new Line([startX, startY, endX, endY], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        objectType: 'straight-line'
      });
    } catch (error) {
      captureError(error, 'create-line-error');
      console.error('Error creating line:', error);
      return null;
    }
  }, [lineColor, lineThickness]);
  
  /**
   * Create distance tooltip
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    try {
      const distanceInMeters = (distance / 100).toFixed(1);
      return new Text(`${distanceInMeters}m`, {
        left: x,
        top: y - 10,
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 2,
        selectable: false
      });
    } catch (error) {
      captureError(error, 'create-tooltip-error');
      console.error('Error creating tooltip:', error);
      return null;
    }
  }, []);
  
  /**
   * Update line and tooltip during drawing
   */
  const updateLineAndTooltip = useCallback((startPoint: LinePoint, endPoint: LinePoint) => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Update line
      if (currentLineRef.current) {
        const points = currentLineRef.current.get('points') as any[];
        if (points && points.length >= 2) {
          points[1] = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y };
          currentLineRef.current.set({ points });
        }
      }
      
      // Calculate distance
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Update tooltip
      if (distanceTooltipRef.current) {
        const distanceInMeters = (distance / 100).toFixed(1);
        distanceTooltipRef.current.set({
          text: `${distanceInMeters}m`,
          left: (startPoint.x + endPoint.x) / 2,
          top: (startPoint.y + endPoint.y) / 2 - 10
        });
      }
      
      // Render the canvas
      canvas.renderAll();
    } catch (error) {
      captureError(error, 'update-line-error');
      console.error('Error updating line and tooltip:', error);
    }
  }, [fabricCanvasRef]);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    if (!fabricCanvasRef.current) return false;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Set canvas properties for drawing
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      canvas.isDrawingMode = false;
      
      setIsToolInitialized(true);
      return true;
    } catch (error) {
      captureError(error, 'init-tool-error');
      console.error('Error initializing tool:', error);
      return false;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle angles snapping
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, [setIsDrawing, setStartPoint, setCurrentLine, setDistanceTooltip]);
  
  // Measurement data (mock for now)
  const measurementData = {
    distance: 0,
    unit: 'm'
  };
  
  return {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    resetDrawingState,
    snapPointToGrid,
    inputMethod,
    setInputMethod,
    isPencilMode,
    setIsPencilMode,
    snapEnabled,
    toggleSnap,
    anglesEnabled,
    toggleAngles,
    initializeTool,
    measurementData
  };
};
