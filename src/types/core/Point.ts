
/**
 * Point interface 
 * Basic 2D coordinate point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points in degrees
 */
export function angleBetweenPoints(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

/**
 * Check if two points are equal
 */
export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Create a point from an event
 */
export function pointFromEvent(event: MouseEvent | TouchEvent): Point {
  if ('touches' in event) {
    const touch = event.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: event.clientX, y: event.clientY };
}
