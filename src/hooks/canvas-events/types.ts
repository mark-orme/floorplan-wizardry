
import { MutableRefObject } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

export interface BaseEventProps {
  fabricCanvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  tool: DrawingMode;
  saveCurrentState?: () => void;
}

export interface EventHandlerResult {
  register: () => void;
  unregister: () => void;
  cleanup: () => void;
}

export interface UsePathEventsProps extends BaseEventProps {
  processCreatedPath?: (path: FabricObject) => void;
  handleMouseUp?: () => void;
}

export interface UseKeyboardEventsProps extends BaseEventProps {
  deleteSelectedObjects?: () => void;
  undo?: () => void;
  redo?: () => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleEscape?: () => void;
  handleDelete?: () => void;
}

export interface UseMouseEventsProps extends BaseEventProps {
  lineColor: string;
  lineThickness: number;
  isSnapping?: boolean;
  gridSize?: number;
  snapToGrid?: (point: Point) => Point;
  handleMouseDown?: (e: any) => void;
  handleMouseMove?: (e: any) => void;
  handleMouseUp?: (e: any) => void;
}

export interface UseObjectEventsProps extends BaseEventProps {
  onObjectAdded?: (e: any) => void;
  onObjectModified?: (e: any) => void;
  onObjectRemoved?: (e: any) => void;
}

export interface UseBrushSettingsProps extends BaseEventProps {
  lineColor: string;
  lineThickness: number;
  usePressure?: boolean;
}

export interface UseCanvasHandlersProps extends BaseEventProps {
  lineColor: string;
  lineThickness: number;
  onDrawingComplete?: () => void;
  eventTypes?: string[];
  handlers?: Record<string, (e: any) => void>;
}

export interface DrawingPathState {
  isDrawing: boolean;
  currentPath: FabricObject | null;
}

export interface UseZoomTrackingProps {
  fabricCanvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  tool?: DrawingMode;
  updateZoomLevel?: () => void;
}

export interface UseZoomTrackingResult {
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  currentZoom?: number;
  register?: () => void;
  unregister?: () => void;
  cleanup?: () => void;
}

export type ZoomDirection = 'in' | 'out';

export interface ZoomOptions {
  center?: Point;
  duration?: number;
}

export interface CanvasEvents {
  [key: string]: (e: any) => void;
}

export interface EventHandlerMap {
  [key: string]: (e: any) => void;
}

export interface EditableFabricObject extends FabricObject {
  set: (options: Record<string, any>) => FabricObject;
}

export interface TargetEvent {
  target: FabricObject;
}

export const ZOOM_LEVEL_CONSTANTS = {
  DEFAULT: 1.0,
  MIN: 0.1,
  MAX: 10.0,
  STEP: 0.1,
  LARGE_STEP: 0.5,
  DEFAULT_ZOOM: 1.0,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10.0,
  ZOOM_STEP: 0.1
};

