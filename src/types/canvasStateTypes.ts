
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/types/FloorPlan';

export interface CanvasState {
  drawingMode: DrawingMode;
  selectedObjectId: string | null;
  objects: CanvasObject[];
  viewportTransform: number[];
  zoom: number;
  // Add missing properties needed by components
  tool?: DrawingMode;
  zoomLevel?: number;
  lineThickness?: number;
  lineColor?: string;
  snapToGrid?: boolean;
}

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  points?: Point[];
  position?: Point;
  properties: Record<string, any>;
}

export type CanvasObjectType = 'wall' | 'room' | 'line' | 'text' | 'image' | 'path';

export interface StrokeProperties {
  color: string;
  width: number;
  opacity: number;
}

export interface WallProperties extends StrokeProperties {
  thickness: number;
  length: number;
}

export interface RoomProperties {
  name: string;
  area: number;
  color: string;
}

export type StrokeTypeLiteral = 'freehand' | 'straight' | 'wall' | 'room';

// Define DrawingTool as an alias to DrawingMode
export type DrawingTool = DrawingMode;

// Define a UseCanvasStateResult interface to fix import errors
export interface UseCanvasStateResult {
  canvas: any;
  setCanvas: React.Dispatch<React.SetStateAction<any>>;
  showGridDebug: boolean;
  setShowGridDebug: React.Dispatch<React.SetStateAction<boolean>>;
  forceRefreshKey: number;
  setForceRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  activeTool: DrawingTool;
  setActiveTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  gridInitializedRef: React.MutableRefObject<boolean>;
  retryCountRef: React.MutableRefObject<number>;
  maxRetries: number;
  canvasStableRef: React.MutableRefObject<boolean>;
  mountedRef: React.MutableRefObject<boolean>;
}

// Define DEFAULT_CANVAS_STATE
export const DEFAULT_CANVAS_STATE: CanvasState = {
  drawingMode: DrawingMode.SELECT,
  selectedObjectId: null,
  objects: [],
  viewportTransform: [1, 0, 0, 1, 0, 0],
  zoom: 1
};

// Export DrawingMode to fix import errors in other files
export { DrawingMode };
