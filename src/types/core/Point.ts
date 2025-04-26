
export interface Point {
  x: number;
  y: number;
}

export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export function distanceBetweenPoints(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
