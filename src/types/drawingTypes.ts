
import { DrawingMode } from "@/constants/drawingModes";

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingLine {
  id: string;
  points: DrawingPoint[];
  color: string;
  thickness: number;
}

export interface DrawingState {
  currentLayerId: string;
  selectedObjects: string[];
  /** The active tool (used by controller) */
  tool?: DrawingMode;
  /** Where a new path started */
  pathStartPoint?: DrawingPoint;
  /** Overrides from UI */
  lineColor?: string;
  lineThickness?: number;
  fillColor?: string;
  snapToGrid?: boolean;
}

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: any[];
}

export enum ZoomDirection {
  IN = 'in',
  OUT = 'out',
  RESET = 'reset'
}

export interface DebugInfoState {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  canvasReady?: boolean;
  zoomLevel?: number;
  mousePosition?: {
    x: number;
    y: number;
  };
}
