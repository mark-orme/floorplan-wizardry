
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/types/FloorPlan';

export interface CanvasState {
  drawingMode: DrawingMode;
  selectedObjectId: string | null;
  objects: CanvasObject[];
  viewportTransform: number[];
  zoom: number;
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

// Export DrawingMode to fix import errors in other files
export { DrawingMode };
