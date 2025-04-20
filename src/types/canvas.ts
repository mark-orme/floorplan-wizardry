
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
  properties?: Record<string, any>;
  points?: Point[];
  options?: Record<string, any>; // Add options field for compatibility
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
  'mouse:down': (e: any) => void;
  'mouse:move': (e: any) => void;
  'mouse:up': (e: any) => void;
  [key: string]: (...args: any[]) => void; // Add index signature for string keys
}

// Add PerformanceMetrics for utils/performance/canvasPerformance.ts
export interface PerformanceMetrics {
  frameRate: number;
  renderTime: number;
  objectCount: number;
  memoryUsage?: number;
  timestamp: number;
}
