
import { Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Enhanced fabric object that supports direct property editing
 */
export interface EditableFabricObject extends FabricObject {
  // Ensuring this matches the FabricObject.set signature
  set(options: Record<string, any>): any;
  set(property: string, value: any): any;
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
}

/**
 * Canvas event handler type
 */
export type CanvasEventHandler = (e: any) => void;

/**
 * Canvas events map
 */
export interface CanvasEventHandlerMap {
  'mouse:down': CanvasEventHandler;
  'mouse:move': CanvasEventHandler;
  'mouse:up': CanvasEventHandler;
  'object:added': CanvasEventHandler;
  'object:removed': CanvasEventHandler;
  'object:modified': CanvasEventHandler;
  'object:rotating': CanvasEventHandler;
  'object:scaling': CanvasEventHandler;
  'object:moving': CanvasEventHandler;
  'selection:created': CanvasEventHandler;
  'selection:updated': CanvasEventHandler;
  'selection:cleared': CanvasEventHandler;
  [key: string]: CanvasEventHandler;
}

// Additional exports for canvas-events/index.ts
export interface BaseEventProps {
  fabricCanvasRef: React.MutableRefObject<any>;
}

export interface UseKeyboardEventsProps extends BaseEventProps {
  handleUndo?: () => void;
  handleRedo?: () => void;
  deleteSelectedObjects?: () => void;
  handleEscape?: () => void;
  handleDelete?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}

export interface UseMouseEventsProps extends BaseEventProps {
  tool?: DrawingMode;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  onMouseDown?: CanvasEventHandler;
  onMouseMove?: CanvasEventHandler;
  onMouseUp?: CanvasEventHandler;
}

export interface UsePathEventsProps extends BaseEventProps {
  tool?: DrawingMode;
  saveCurrentState?: () => void;
  processCreatedPath?: (path: any) => void;
  handleMouseUp?: () => void;
  onPathCreated?: (path: any) => void;
  onPathCancelled?: () => void;
}

export interface EventHandlerResult {
  register: () => void;
  unregister: () => void;
  cleanup?: () => void;
}

export interface DrawingPathState {
  isDrawing: boolean;
  currentPath: any | null;
}

export interface UseObjectEventsProps extends BaseEventProps {
  tool?: DrawingMode;
  saveCurrentState?: () => void;
  lineColor?: string;
  lineThickness?: number;
  onObjectAdded?: (e: any) => void;
  onObjectRemoved?: (e: any) => void;
  onObjectModified?: (e: any) => void;
}

export interface UseBrushSettingsProps extends BaseEventProps {
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  usePressure?: boolean;
  brushColor?: string;
  brushWidth?: number;
}

export interface UseCanvasHandlersProps extends BaseEventProps {
  tool?: DrawingMode;
  eventTypes?: string[];
  handlers?: Partial<CanvasEventHandlerMap>;
}

export interface UseZoomTrackingProps extends BaseEventProps {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  updateZoomLevel?: () => void;
}

export interface UseZoomTrackingResult {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  currentZoom?: number;
}

export enum ZoomDirection {
  In = 'in',
  Out = 'out',
  Reset = 'reset'
}

export interface ZoomOptions {
  step?: number;
  max?: number;
  min?: number;
}

export interface CanvasEvents {
  register: () => void;
  unregister: () => void;
}

export interface EventHandlerMap {
  [key: string]: CanvasEventHandler;
}

export interface TargetEvent {
  target: EditableFabricObject;
}

export const ZOOM_LEVEL_CONSTANTS = {
  DEFAULT: 1,
  MIN: 0.1,
  MAX: 5,
  STEP: 0.1
};
