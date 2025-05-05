
/**
 * Point utility
 * Provides a consistent interface for working with points
 */

/**
 * Represents a point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a new point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Creates a point from an event
 */
export function pointFromEvent(event: MouseEvent | TouchEvent): Point {
  if ('touches' in event) {
    // Touch event
    if (event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    // Fall back to changed touches if available
    if (event.changedTouches && event.changedTouches.length > 0) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      };
    }
    // Default to 0,0 if no touches found
    return { x: 0, y: 0 };
  }
  
  // Mouse event
  return {
    x: event.clientX,
    y: event.clientY
  };
}

/**
 * Adds two points
 */
export function addPoints(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

/**
 * Subtracts point b from point a
 */
export function subtractPoints(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

/**
 * Calculates the distance between two points
 */
export function distanceBetweenPoints(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Checks if two points are equal
 */
export function arePointsEqual(a: Point, b: Point, threshold = 0): boolean {
  if (threshold === 0) {
    return a.x === b.x && a.y === b.y;
  }
  return distanceBetweenPoints(a, b) <= threshold;
}

/**
 * Multiplies a point by a scalar
 */
export function multiplyPoint(point: Point, scalar: number): Point {
  return {
    x: point.x * scalar,
    y: point.y * scalar
  };
}

/**
 * Creates a copy of a point
 */
export function copyPoint(point: Point): Point {
  return { x: point.x, y: point.y };
}

/**
 * Converts a Fabric.js point to our Point interface
 */
export function fromFabricPoint(fabricPoint: any): Point {
  if (!fabricPoint) return { x: 0, y: 0 };
  
  if (typeof fabricPoint.x === 'number' && typeof fabricPoint.y === 'number') {
    return {
      x: fabricPoint.x,
      y: fabricPoint.y
    };
  }
  
  return { x: 0, y: 0 };
}

/**
 * Converts our Point interface to a Fabric.js point
 */
export function toFabricPoint(point: Point): any {
  if (typeof fabric !== 'undefined' && fabric.Point) {
    return new fabric.Point(point.x, point.y);
  }
  
  // Return a compatible object if fabric.Point is not available
  return {
    x: point.x,
    y: point.y,
    add: function(p: any) { 
      return toFabricPoint({ x: this.x + p.x, y: this.y + p.y }); 
    },
    subtract: function(p: any) { 
      return toFabricPoint({ x: this.x - p.x, y: this.y - p.y }); 
    },
    multiply: function(scalar: number) { 
      return toFabricPoint({ x: this.x * scalar, y: this.y * scalar }); 
    }
  };
}
