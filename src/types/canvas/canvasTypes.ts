
import { Point } from '@/types/core/Point';

export interface DrawOptions {
  color?: string;
  thickness?: number;
  opacity?: number;
  fill?: string;
  strokeType?: string;
  objectType?: string;
  metadata?: Record<string, any>;
}

export interface CanvasObject {
  id: string;
  type: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  points?: Point[];
  path?: any[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  metadata?: Record<string, any>;
}

export interface StrokeStyle {
  color: string;
  width: number;
  dashArray?: number[];
  dashOffset?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

export interface CanvasAction {
  type: string;
  payload?: any;
  timestamp: number;
}
