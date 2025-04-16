
/**
 * Line initialization hook
 * Handles initialization of the straight line tool
 * @module hooks/straightLineTool/useLineInitialization
 */
import { useCallback, useRef } from 'react';
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

/**
 * Line initialization options
 */
export interface LineInitOptions {
  color: string;
  thickness: number;
  dashed?: boolean;
}

/**
 * Line initialization hook
 * @returns Initialization functions for line tool
 */
export const useLineInitialization = () => {
  const lineRef = useRef<Line | null>(null);
  
  /**
   * Create a new line instance
   * @param points Start and end points
   * @param options Line options
   * @returns Fabric.js Line object
   */
  const createLine = useCallback((points: [Point, Point], options: LineInitOptions): Line => {
    const [start, end] = points;
    
    const lineOptions = {
      stroke: options.color,
      strokeWidth: options.thickness,
      strokeDashArray: options.dashed ? [5, 5] : undefined,
      selectable: true,
      evented: true
    };
    
    return new Line([start.x, start.y, end.x, end.y], lineOptions);
  }, []);
  
  /**
   * Initialize a new line on the canvas
   * @param canvas Fabric canvas
   * @param startPoint Starting point
   * @param options Line options
   */
  const initializeLine = useCallback((
    canvas: Canvas | null,
    startPoint: Point,
    options: LineInitOptions
  ): Line | null => {
    if (!canvas) return null;
    
    // Create initial line with same start and end point
    const line = createLine(
      [startPoint, startPoint], 
      options
    );
    
    canvas.add(line);
    lineRef.current = line;
    
    return line;
  }, [createLine]);
  
  /**
   * Clean up any existing line
   * @param canvas Fabric canvas
   */
  const cleanupLine = useCallback((canvas: Canvas | null): void => {
    if (!canvas || !lineRef.current) return;
    
    canvas.remove(lineRef.current);
    canvas.renderAll();
    lineRef.current = null;
  }, []);
  
  return {
    createLine,
    initializeLine,
    cleanupLine,
    lineRef
  };
};
