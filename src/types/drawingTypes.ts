
import { ZoomDirection } from './drawingStateTypes';

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

/**
 * Interface for drawing state
 */
export interface DrawingState {
  /** Drawing mode */
  mode: string;
  /** Whether drawing is currently active */
  isDrawing: boolean;
  /** Drawing points */
  points: DrawingPoint[];
  /** Current stroke */
  strokeStyle: StrokeStyle;
  /** Current fill */
  fillStyle?: FillStyle;
  /** Whether snap to grid is enabled */
  snapToGrid: boolean;
  /** Current layer id */
  currentLayerId: string;
  /** Selected object ids */
  selectedObjects: string[];
  /** Last action timestamp */
  lastActionTimestamp?: string;
}

/**
 * Default drawing state
 */
export const DEFAULT_DRAWING_STATE: DrawingState = {
  mode: 'select',
  isDrawing: false,
  points: [],
  strokeStyle: { color: '#000000', width: 2 },
  fillStyle: { color: 'transparent' },
  snapToGrid: true,
  currentLayerId: 'default',
  selectedObjects: []
};

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  fps?: number;
  objects?: number;
  visible?: number;
  width?: number;
  height?: number;
  zoom?: number;
  isDrawingMode?: boolean;
  canvasReady?: boolean;
}

/**
 * State for canvas controller
 */
export interface CanvasControllerState {
  width: number;
  height: number;
  zoom: number;
  tool: string;
  isDrawing: boolean;
  showGrid: boolean;
  showRulers: boolean;
  snap: boolean;
}

/**
 * Default canvas controller state
 */
export const DEFAULT_CANVAS_STATE: CanvasControllerState = {
  width: 800,
  height: 600,
  zoom: 1,
  tool: 'select',
  isDrawing: false,
  showGrid: true,
  showRulers: false,
  snap: true
};
