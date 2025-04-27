import { useCallback, useRef } from 'react';
import { Canvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from './types';
import { LineStateInterface } from './lineEvents';
import { DrawingMode } from '@/constants/drawingModes';

interface UseStraightLineToolProps {
  isActive: boolean;
  canvas: Canvas | null;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
}

interface CommandHistory {
  command: 'create' | 'update' | 'delete';
  data: {
    line?: Line;
    tooltip?: Text;
    points?: {
      start: Point;
      end: Point;
    };
  };
}

export const useStraightLineTool = ({
  isActive,
  canvas,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState
}: UseStraightLineToolProps): LineStateInterface => {
  const isDrawingRef = useRef(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isToolInitialized, setIsToolInitialized] = React.useState(false);
  const [snapEnabled, setSnapEnabled] = React.useState(true);
  const [anglesEnabled, setAnglesEnabled] = React.useState(false);
  const [measurementData, setMeasurementData] = React.useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });
  
  // Refs
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  const undoHistory = useRef<CommandHistory[]>([]);
  const redoHistory = useRef<CommandHistory[]>([]);
  
  // Initialize snap to grid
  const gridSize = 10;
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const newX = Math.round(point.x / gridSize) * gridSize;
    const newY = Math.round(point.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  }, [snapEnabled, gridSize]);
  
  // Initialize angle snapping
  const snapAngle = 15; // Snap every 15 degrees
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!anglesEnabled) return { start, end };
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Snap to nearest angle
    const snappedAngle = Math.round(angle / snapAngle) * snapAngle;
    
    // Convert back to radians
    const snappedAngleRad = snappedAngle * Math.PI / 180;
    
    // Calculate new end point
    const distance = Math.sqrt(dx * dx + dy * dy);
    const newEndX = start.x + distance * Math.cos(snappedAngleRad);
    const newEndY = start.y + distance * Math.sin(snappedAngleRad);
    
    return {
      start: start,
      end: { x: newEndX, y: newEndY }
    };
  }, [anglesEnabled, snapAngle]);
  
  // Measurement calculation
  const calculateDistance = useCallback((start: Point, end: Point): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  const calculateAngle = useCallback((start: Point, end: Point): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }, []);
  
  const getMeasurements = useCallback((start: Point, end: Point): MeasurementData => {
    const distance = calculateDistance(start, end);
    const angle = calculateAngle(start, end);
    
    return {
      distance: distance,
      angle: angle,
      snapped: snapEnabled || anglesEnabled,
      unit: 'px',
      snapType: snapEnabled && anglesEnabled ? 'both' : snapEnabled ? 'grid' : anglesEnabled ? 'angle' : undefined
    };
  }, [calculateDistance, calculateAngle, snapEnabled, anglesEnabled]);
  
  // Line creation
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number): Line => {
    return new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      objectCaching: false
    });
  }, [lineColor, lineThickness]);
  
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number): Text => {
    return new Text(distance.toFixed(2) + ' px', {
      left: x,
      top: y,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#333',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 3,
      textAlign: 'center',
      originX: 'center',
      originY: 'bottom',
      selectable: false,
      evented: false,
      objectCaching: false
    });
  }, []);
  
  // Line updating
  const updateLineAndTooltip = useCallback((start: Point, end: Point) => {
    if (!canvas || !currentLineRef.current || !distanceTooltipRef.current) return;
    
    const snappedStart = snapPointToGrid(start);
    const snappedEnd = snapPointToGrid(end);
    
    currentLineRef.current.set({
      x1: snappedStart.x,
      y1: snappedStart.y,
      x2: snappedEnd.x,
      y2: snappedEnd.y
    });
    
    const distance = calculateDistance(snappedStart, snappedEnd);
    distanceTooltipRef.current.set({
      left: snappedEnd.x,
      top: snappedEnd.y,
      text: distance.toFixed(2) + ' px'
    });
    
    setMeasurementData(getMeasurements(snappedStart, snappedEnd));
    
    canvas.requestRenderAll();
  }, [canvas, snapPointToGrid, calculateDistance, getMeasurements]);
  
  // Event handlers
  const handlePointerDown = useCallback((point: Point) => {
    if (!canvas || !isEnabled) return;
    
    setIsDrawing(true);
    setStartPoint(point);
    
    const line = createLine(point.x, point.y, point.x, point.y);
    setCurrentLine(line);
    canvas.add(line);
    
    const history: CommandHistory = {
      command: 'create',
      data: { line }
    };
    undoHistory.current.push(history);
  }, [canvas, isEnabled, createLine]);
  
  const handlePointerMove = useCallback((point: Point) => {
    if (!isDrawing || !canvas || !startPointRef.current || !currentLineRef.current) return;
    
    const endPoint = snapPointToGrid(point);
    updateLineAndTooltip(startPointRef.current, endPoint);
    
    canvas.requestRenderAll();
  }, [isDrawing, canvas, snapPointToGrid, updateLineAndTooltip]);
  
  const handlePointerUp = useCallback(() => {
    if (!isDrawing || !canvas || !currentLineRef.current || !startPointRef.current) return;
    
    setIsDrawing(false);
    canvas.selection = true;
    
    const endPoint = snapPointToGrid({
      x: currentLineRef.current.x2 || 0,
      y: currentLineRef.current.y2 || 0
    });
    
    updateLineAndTooltip(startPointRef.current, endPoint);
    
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [isDrawing, canvas, snapPointToGrid, updateLineAndTooltip, saveCurrentState]);
  
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !canvas || !currentLineRef.current || !distanceTooltipRef.current) return;
    
    canvas.remove(currentLineRef.current, distanceTooltipRef.current);
    setIsDrawing(false);
    canvas.selection = true;
    resetDrawingState();
  }, [isDrawing, canvas]);
  
  // Tool lifecycle
  const initializeTool = useCallback(() => {
    if (!canvas || isToolInitialized) return;
    
    canvas.on('mouse:down', (event: any) => {
      if (event.button !== 1) return; // Only left click
      const pointer = canvas.getPointer(event.e);
      handlePointerDown(pointer);
    });
    
    canvas.on('mouse:move', (event: any) => {
      const pointer = canvas.getPointer(event.e);
      handlePointerMove(pointer);
    });
    
    canvas.on('mouse:up', handlePointerUp);
    
    setIsToolInitialized(true);
  }, [canvas, isToolInitialized, handlePointerDown, handlePointerMove, handlePointerUp]);
  
  const resetDrawingState = useCallback(() => {
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    setIsDrawing(false);
    setMeasurementData({
      distance: null,
      angle: null,
      snapped: false,
      unit: 'px'
    });
  }, []);
  
  // Enable/disable tool
  const isEnabled = isActive && !!canvas;
  
  React.useEffect(() => {
    if (!canvas) return;
    
    if (isEnabled) {
      initializeTool();
      canvas.selection = false;
    } else {
      canvas.selection = true;
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    }
    
    return () => {
      resetDrawingState();
      setIsToolInitialized(false);
      canvas.selection = true;
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    };
  }, [canvas, isEnabled, initializeTool, resetDrawingState]);
  
  // Toggle snap
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angles
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  return {
    isDrawing,
    isActive,
    isToolInitialized,
    inputMethod: 'mouse',
    isPencilMode: false,
    snapEnabled,
    anglesEnabled,
    measurementData,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsDrawing,
    resetDrawingState,
    initializeTool,
    toggleSnap,
    toggleGridSnapping,
    toggleAngles,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    snapPointToGrid,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    currentLine: currentLineRef.current
  };
};
