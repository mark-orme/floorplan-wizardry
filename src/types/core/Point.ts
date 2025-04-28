
export interface Point {
  x: number;
  y: number;
}

export type PointPair = [Point, Point];

export interface PointWithPressure extends Point {
  pressure?: number;
  tilt?: {
    x: number;
    y: number;
  };
}

export interface PointWithMetadata extends Point {
  timestamp?: number;
  type?: 'move' | 'down' | 'up';
  id?: string;
}
