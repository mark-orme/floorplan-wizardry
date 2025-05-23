
export interface Point {
  x: number;
  y: number;
}

export const isValidPoint = (point: any): point is Point => {
  return point !== null && 
         typeof point === 'object' && 
         typeof point.x === 'number' && 
         typeof point.y === 'number';
};

export const createPoint = (x: number = 0, y: number = 0): Point => ({ x, y });

// Add the pointsEqual function that was referenced but missing
export const pointsEqual = (a: Point | null | undefined, b: Point | null | undefined, threshold = 0): boolean => {
  if (!a || !b) return false;
  
  if (threshold === 0) {
    return a.x === b.x && a.y === b.y;
  }
  
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx <= threshold && dy <= threshold;
};

// Alias for pointsEqual for backwards compatibility
export const arePointsEqual = pointsEqual;
