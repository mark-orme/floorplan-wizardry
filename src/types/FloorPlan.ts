
import { Point } from './core/Point';

export type StrokeTypeLiteral = 'line' | 'curve' | 'rectangle' | 'circle' | 'eraser';

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  thickness: number;
  width: number;
  type: StrokeTypeLiteral;
}

export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  updated?: string;
  data?: any;
  thumbnail?: string;
}
