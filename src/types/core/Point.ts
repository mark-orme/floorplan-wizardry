
/**
 * Basic point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a new point
 */
export const createPoint = (x: number, y: number): Point => ({ x, y });

/**
 * Calculate distance between two points
 */
export const distance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the angle between two points in degrees
 */
export const angle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Default point at origin
 */
export const ORIGIN: Point = { x: 0, y: 0 };

export default Point;
