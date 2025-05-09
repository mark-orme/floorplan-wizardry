
import { Point } from './core/Point';

/**
 * Measurement data for straight line tool
 */
export interface MeasurementData {
  startPoint?: Point | null;
  endPoint?: Point | null;
  distance?: number | undefined;
  angle?: number | undefined;
  midPoint?: Point;
  unit?: string;
  units?: string;
  snapped?: boolean;
  pixelsPerMeter?: number;
}

/**
 * Extended Canvas interface to ensure viewportTransform is defined
 */
export interface ExtendedCanvas {
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
  viewportTransform: number[]; // non-optional
  allowTouchScrolling?: boolean;
  renderOnAddRemove: boolean; // Changed to non-optional
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: any) => void) => void;
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
}

/**
 * Debug info state for canvas
 */
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  renderTime: number;
  memoryUsage?: {
    usedJSHeapSize?: number;
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
  };
  performanceMetrics?: {
    lastFrameTime: number;
    averageFrameTime: number;
  };
}

/**
 * Grid options for grid rendering
 */
export interface GridOptions {
  cellSize?: number;
  color?: string;
  opacity?: number;
  showLabels?: boolean;
  showAxes?: boolean;
  thickness?: number;
}

/**
 * Extended Performance interface with non-standard memory property
 */
export interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
  };
}
