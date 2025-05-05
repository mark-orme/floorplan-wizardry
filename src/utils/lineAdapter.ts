
/**
 * Line Adapter
 * Provides utilities for working with lines that might have different property names
 */
import { Point } from '@/utils/geometry/Point';

// Define the common types for standardization
export interface LineWithStartEnd {
  start: Point;
  end: Point;
}

// Line representation with startPoint/endPoint properties
export interface LineWithStartPointEndPoint {
  startPoint: Point;
  endPoint: Point;
}

// Generic line type that could have either property set
export type Line = LineWithStartEnd | LineWithStartPointEndPoint;

/**
 * Check if a line uses start/end properties
 */
export function hasStartEnd(line: any): line is LineWithStartEnd {
  return line && 'start' in line && 'end' in line;
}

/**
 * Check if a line uses startPoint/endPoint properties
 */
export function hasStartPointEndPoint(line: any): line is LineWithStartPointEndPoint {
  return line && 'startPoint' in line && 'endPoint' in line;
}

/**
 * Convert a line to use start/end properties
 */
export function toStartEndFormat(line: Line): LineWithStartEnd {
  if (hasStartEnd(line)) {
    return line;
  }
  
  return {
    start: line.startPoint,
    end: line.endPoint
  };
}

/**
 * Convert a line to use startPoint/endPoint properties
 */
export function toStartPointEndPointFormat(line: Line): LineWithStartPointEndPoint {
  if (hasStartPointEndPoint(line)) {
    return line;
  }
  
  return {
    startPoint: line.start,
    endPoint: line.end
  };
}

/**
 * Get start point regardless of line format
 */
export function getStartPoint(line: Line): Point {
  if (hasStartEnd(line)) {
    return line.start;
  }
  return line.startPoint;
}

/**
 * Get end point regardless of line format
 */
export function getEndPoint(line: Line): Point {
  if (hasStartEnd(line)) {
    return line.end;
  }
  return line.endPoint;
}

/**
 * Set start point regardless of line format
 */
export function setStartPoint(line: Line, point: Point): Line {
  if (hasStartEnd(line)) {
    return {
      ...line,
      start: point
    };
  }
  
  return {
    ...line,
    startPoint: point
  };
}

/**
 * Set end point regardless of line format
 */
export function setEndPoint(line: Line, point: Point): Line {
  if (hasStartEnd(line)) {
    return {
      ...line,
      end: point
    };
  }
  
  return {
    ...line,
    endPoint: point
  };
}

/**
 * Creates a fabric line from our line interface
 */
export function createFabricLine(line: Line, options: any = {}) {
  try {
    const start = getStartPoint(line);
    const end = getEndPoint(line);
    
    if (typeof fabric !== 'undefined' && fabric.Line) {
      return new fabric.Line([start.x, start.y, end.x, end.y], options);
    }
    return null;
  } catch (e) {
    console.error('Error creating fabric line:', e);
    return null;
  }
}
