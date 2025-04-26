
export enum ZoomDirection {
  IN = 'in',
  OUT = 'out',
  RESET = 'reset'
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface StrokeStyle {
  color: string;
  width: number;
  opacity?: number;
  dash?: number[];
}

export interface FillStyle {
  color: string;
  opacity?: number;
  pattern?: string;
}

export interface DrawingObject {
  id: string;
  type: string;
  position: DrawingPoint;
  rotation?: number;
  strokeStyle?: StrokeStyle;
  fillStyle?: FillStyle;
  selected: boolean;
  visible: boolean;
  locked: boolean;
  layerId: string;
}
