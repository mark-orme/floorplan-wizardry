
import { Canvas as FabricCanvas } from 'fabric';

// Core Point interface
export interface Point {
  x: number;
  y: number;
}

// Paper Size enum
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter'
}

// Type definitions for strokes and rooms
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';
export type StrokeType = StrokeTypeLiteral;

export type RoomTypeLiteral = 'kitchen' | 'bathroom' | 'bedroom' | 'living' | 'dining' | 'office' | 'hallway' | 'other';
export type RoomType = RoomTypeLiteral;

// Wall interface
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  startPoint?: Point;
  endPoint?: Point;
  thickness: number;
  height?: number;
  color: string;
  roomIds?: string[];
  length: number;
  points: Point[];
}

// Stroke interface
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width?: number;
}

// Room interface
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string;
  area: number;
  level?: number;
  walls?: string[]; // Optional walls array
}

// Floor plan metadata
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: string;
  level: number;
}

// Main FloorPlan interface that combines both the simplified version and the detailed version
export interface FloorPlan {
  // Core properties (needed for current implementation)
  id: string;
  name: string;
  order?: number;
  
  // Canvas state from serializer
  canvasState?: ReturnType<typeof import('@/utils/canvas/canvasSerializer').serializeCanvasState>;
  
  // Properties needed by other parts of the application
  label?: string;
  walls?: Wall[];
  rooms?: Room[];
  strokes?: Stroke[];
  createdAt?: string;
  updatedAt?: string;
  gia?: number;
  level?: number;
  index?: number;
  canvasData?: any | null;
  canvasJson?: any | null;
  metadata?: FloorPlanMetadata;
}
