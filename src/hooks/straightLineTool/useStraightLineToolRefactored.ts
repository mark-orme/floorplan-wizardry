// Import fabric library correctly
import { fabric } from 'fabric';
import { useState, useCallback, useMemo } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/types/fabric-unified';

// Default measurement data
const defaultMeasurementData: MeasurementData = {
  distance: 0,
  angle: 0,
  unit: 'px',
  snapped: false
};

/**
 * Refactored hook for the straight line tool
 */
export const useStraightLineToolRefactored = (initialData: MeasurementData = defaultMeasurementData) => {
  const [measurementData, setMeasurementData] = useState<MeasurementData>(initialData);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToAngles, setSnapToAngles] = useState(false);
  const [currentLine, setCurrentLine] = useState<fabric.Line | null>(null);
  
  /**
   * Calculate the angle between two points
   */
  const calculateAngle = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);
  
  /**
   * Calculate the distance between two points
   */
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  /**
   * Snap the point to the nearest grid cell
   */
  const snapPointToGrid = useCallback((point: Point, gridSize: number = 20): Point => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapToGrid]);
  
  /**
   * Snap the end point to common angles from the start point
   */
  const snapToCommonAngles = useCallback((startP: Point, endP: Point): Point => {
    if (!snapToAngles || !startP) return endP;
    
    const angle = calculateAngle(startP, endP);
    const distance = calculateDistance(startP, endP);
    const snapAngle = Math.round(angle / 45) * 45;
    
    const snappedAngle = snapAngle * (Math.PI / 180);
    return {
      x: startP.x + Math.cos(snappedAngle) * distance,
      y: startP.y + Math.sin(snappedAngle) * distance
    };
  }, [snapToAngles, calculateAngle, calculateDistance]);
  
  /**
   * Create a new line on the canvas
   */
  const createLine = useCallback((canvas: fabric.Canvas | null, start: Point, end: Point, options?: any) => {
    if (!canvas) return null;
    
    const line = new fabric.Line([start.x, start.y, end.x, end.y], {
      stroke: options?.stroke || '#000000',
      strokeWidth: options?.strokeWidth || 2,
      selectable: true,
      evented: true,
      ...options
    });
    
    canvas.add(line);
    canvas.renderAll();
    return line;
  }, []);
  
  /**
   * Update an existing line on the canvas
   */
  const updateLine = useCallback((line: fabric.Line | null, start: Point, end: Point) => {
    if (!line) return;
    
    line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
    
    if (line.canvas) {
      line.canvas.renderAll();
    }
  }, []);
  
  /**
   * Start drawing a line
   */
  const startDraw = useCallback((canvas: fabric.Canvas | null, point: Point) => {
    setIsDrawing(true);
    const snappedStart = snapPointToGrid(point);
    setStartPoint(snappedStart);
    setEndPoint(snappedStart);
    
    const newLine = createLine(canvas, snappedStart, snappedStart);
    setCurrentLine(newLine);
    
    // Update measurement data
    setMeasurementData({
      startPoint: snappedStart,
      endPoint: snappedStart,
      distance: 0,
      angle: 0,
      unit: measurementData.unit || 'px',
      snapped: snapToGrid
    });
  }, [createLine, snapPointToGrid, measurementData.unit]);
  
  /**
   * Continue drawing a line (mousemove)
   */
  const continueDraw = useCallback((canvas: fabric.Canvas | null, point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Snap end point if needed
    let snappedEnd = snapPointToGrid(point);
    if (snapToAngles) {
      snappedEnd = snapToCommonAngles(startPoint, snappedEnd);
    }
    
    // Update current end point
    setEndPoint(snappedEnd);
    
    // Update the line
    updateLine(currentLine, startPoint, snappedEnd);
    
    // Update measurement data
    const distance = calculateDistance(startPoint, snappedEnd);
    const angle = calculateAngle(startPoint, snappedEnd);
    
    setMeasurementData({
      startPoint,
      endPoint: snappedEnd,
      distance,
      angle,
      unit: measurementData.unit || 'px',
      snapped: snapToGrid || snapToAngles,
      snapType: snapToAngles ? 'angle' : (snapToGrid ? 'grid' : undefined)
    });
  }, [isDrawing, startPoint, snapPointToGrid, snapToCommonAngles, updateLine, currentLine, calculateDistance, calculateAngle, measurementData.unit]);
  
  /**
   * Complete the line drawing (mouseup)
   */
  const completeDraw = useCallback((canvas: fabric.Canvas | null) => {
    setIsDrawing(false);
    
    // Finalize the line - this is where you might add specific behaviors
    // like recording the line's final position in app state
    
    // Reset the current line reference but keep start/end for measurements
    setCurrentLine(null);
    
    return {
      start: startPoint,
      end: endPoint,
      distance: measurementData.distance || 0,
      angle: measurementData.angle || 0
    };
  }, [startPoint, endPoint, measurementData]);
  
  /**
   * Cancel the current drawing operation
   */
  const cancelDraw = useCallback((canvas: fabric.Canvas | null) => {
    if (currentLine && canvas) {
      canvas.remove(currentLine);
      canvas.renderAll();
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
    setCurrentLine(null);
    
    // Reset measurement data
    setMeasurementData({
      ...defaultMeasurementData,
      unit: measurementData.unit
    });
  }, [currentLine, measurementData.unit]);
  
  return {
    isDrawing,
    startPoint,
    endPoint,
    measurementData,
    snapToGrid,
    snapToAngles,
    setSnapToGrid,
    setSnapToAngles,
    startDraw,
    continueDraw,
    completeDraw,
    cancelDraw
  };
};
