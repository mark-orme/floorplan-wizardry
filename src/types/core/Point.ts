
/**
 * Simple Point interface used throughout the application
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Helper functions for working with points
 */
export const createPoint = (x: number, y: number): Point => ({ x, y });

export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

export default Point;
