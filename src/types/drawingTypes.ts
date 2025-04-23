
import { Point } from './core/Point';

/**
 * Gesture types enumeration
 */
export type GestureType = 'pinch' | 'pan' | 'rotate' | 'tap';

/**
 * Gesture state interface
 */
export interface GestureStateObject {
  type: GestureType;
  startPoints: Point[];
  currentPoints: Point[];
  scale: number;
  rotation: number;
  translation: Point;
  center: Point;
}

/**
 * Gesture state type
 */
export type GestureState = GestureStateObject;

/**
 * Debug information state
 */
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  viewportScale: number;
  isDrawingMode: boolean;
  selectionActive: boolean;
  renderedFrames: number;
  canvasReady?: boolean;
  canvasInitialized?: boolean;
  canvasCreated?: boolean;
  dimensionsSet?: boolean;
}

/**
 * Zoom direction enumeration
 */
export enum ZoomDirection {
  IN = 'in',
  OUT = 'out',
  RESET = 'reset'
}

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  currentTool: string;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
  opacity: number;
  selectedObjects: string[];
}
