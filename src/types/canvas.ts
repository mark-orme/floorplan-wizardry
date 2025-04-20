
export interface Point {
  x: number;
  y: number;
}

export interface DrawOptions {
  color: string;
  width: number;
  opacity?: number;
}

export interface CanvasObject {
  id: string;
  type: string;
}

export interface StrokeStyle {
  color: string;
  width: number;
  opacity: number;
}

export interface CanvasEvents {
  'object:added': (e: { target: CanvasObject }) => void;
  'object:modified': (e: { target: CanvasObject }) => void;
  'object:removed': (e: { target: CanvasObject }) => void;
  'selection:created': (e: { target: CanvasObject[] }) => void;
  'selection:updated': (e: { target: CanvasObject[] }) => void;
  'selection:cleared': () => void;
  'path:created': (e: { path: CanvasObject }) => void;
}
