
/**
 * Standard Point interface for consistency across the application
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a new Point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Checks if two points are equal
 */
export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Creates a point from an array [x, y]
 */
export function pointFromArray(arr: number[]): Point {
  return { x: arr[0], y: arr[1] };
}

/**
 * Converts a point to array [x, y]
 */
export function pointToArray(point: Point): [number, number] {
  return [point.x, point.y];
}
