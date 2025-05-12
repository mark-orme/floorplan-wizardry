
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
