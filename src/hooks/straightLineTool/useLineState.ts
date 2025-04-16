
import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLinePreview } from './useLinePreview';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

export interface LineState {
  isDrawing: boolean;
  isActive: boolean;
  isToolInitialized: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  currentLine: any | null;
  distanceTooltip: any | null;
  fabricCanvasRef: { current: FabricCanvas | null };
  lineColor: string;
  lineThickness: number;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;

  // Methods
  initializeTool: () => void;
  resetDrawingState: () => void;
  toggleSnap: () => void;
  toggleAngles: () => void;
  createLine: (p1: Point, p2: Point) => any;
  createDistanceTooltip: (text: string, position: Point) => any;
  setInputMethod: (method: InputMethod) => void;
  setIsPencilMode: (isPencilMode: boolean) => void;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  cancelDrawing: () => void;
}

export const useLineState = (
  initialColor: string = '#000000',
  initialThickness: number = 2
): LineState => {
  // Canvas reference
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<any | null>(null);
  const [lineColor, setLineColor] = useState(initialColor);
  const [lineThickness, setLineThickness] = useState(initialThickness);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Snap and angles state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  
  // Use our new line preview hook
  const {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview,
    distanceTooltip
  } = useLinePreview(
    fabricCanvasRef,
    isDrawing,
    snapEnabled,
    anglesEnabled,
    lineColor,
    lineThickness
  );

  /**
   * Initialize the drawing tool
   */
  const initializeTool = () => {
    if (isToolInitialized) return;
    
    setIsActive(true);
    setIsToolInitialized(true);
  };

  /**
   * Reset the drawing state
   */
  const resetDrawingState = () => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    clearLinePreview();
  };

  /**
   * Toggle snap to grid
   */
  const toggleSnap = () => {
    setSnapEnabled(prev => !prev);
  };

  /**
   * Toggle angle constraints
   */
  const toggleAngles = () => {
    setAnglesEnabled(prev => !prev);
  };

  /**
   * Create a new line
   */
  const createLine = (p1: Point, p2: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    const line = new Line([p1.x, p1.y, p2.x, p2.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true
    });
    
    canvas.add(line);
    canvas.requestRenderAll();
    
    return line;
  };

  /**
   * Create a distance tooltip
   */
  const createDistanceTooltip = (text: string, position: Point) => {
    // We now use the updateDistanceTooltip function from useLinePreview
    // This is a stub for backward compatibility
    return null;
  };

  /**
   * Start drawing from a point
   */
  const startDrawing = (point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    // Show hover indicator at start point
    showHoverIndicator(point);
  };

  /**
   * Continue drawing to a point
   */
  const continueDrawing = (point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    setCurrentPoint(point);
    
    // Update line preview with potential snapping
    if (startPoint) {
      updateLinePreview(startPoint, point);
    }
  };

  /**
   * Complete drawing at a point
   */
  const completeDrawing = (point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Get the potentially snapped end point
    const preview = startPoint && updateLinePreview(startPoint, point);
    const endPoint = preview?.endPoint || point;
    
    // Create the final line
    const line = createLine(startPoint, endPoint);
    if (line) {
      setCurrentLine(line);
    }
    
    // Clean up preview
    clearLinePreview();
    hideHoverIndicator();
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  /**
   * Cancel the current drawing
   */
  const cancelDrawing = () => {
    clearLinePreview();
    hideHoverIndicator();
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
  };

  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    fabricCanvasRef,
    lineColor,
    lineThickness,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    
    initializeTool,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    createLine,
    createDistanceTooltip,
    setInputMethod,
    setIsPencilMode,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};
