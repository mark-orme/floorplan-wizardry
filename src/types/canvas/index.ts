
// Fixed type export to avoid conflict
export type { Point } from '../core/Point';

export interface GridOptions {
  visible: boolean;
  size: number;
  snapEnabled: boolean;
  color: string;
  opacity: number;
  subdivisions: number;
  majorLineFrequency: number;
  majorLineColor: string;
  majorLineOpacity: number;
  majorLineWidth: number;
  minorLineWidth: number;
}

export interface CanvasZoomOptions {
  min: number;
  max: number;
  step: number;
  initial: number;
  pinchEnabled: boolean;
  wheelEnabled: boolean;
  sensitivity: number;
}

export interface CanvasPanOptions {
  enabled: boolean;
  panKey: string | null;
  momentum: boolean;
  restrictToCanvas: boolean;
}

export interface CanvasStateSnapshot {
  objects: any[];
  viewportTransform: number[];
  zoom: number;
  gridOptions: GridOptions;
  activeObject: any | null;
  timestamp: number;
}

export interface CanvasErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  timestamp: number;
}

// Additional export types
export * from './canvasEvents';
export * from './canvasControls';
export * from './canvasObjects';
export * from './canvasOperations';
export * from './canvasRendering';
