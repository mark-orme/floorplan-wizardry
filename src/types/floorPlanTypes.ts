
/**
 * Floor plan type definitions
 */

export interface FloorPlan {
  id?: string;
  name?: string;
  rooms?: Room[];
  walls?: Wall[];
  metadata?: FloorPlanMetadata;
  strokes?: Stroke[];
  label?: string;
  index?: number;
  gia?: number;
  level?: number;
  canvasData?: string | null;
  canvasJson?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Room {
  id: string;
  name?: string;
  walls: Wall[];
  area?: number;
  type?: RoomTypeLiteral;
  points?: Point[];
  color?: string;
  level?: number;
  [key: string]: any;
}

export interface Wall {
  id: string;
  points: Point[];
  length?: number;
  thickness?: number;
  startPoint?: Point;
  endPoint?: Point;
  start?: Point;
  end?: Point;
  color?: string;
  roomIds?: string[];
  height?: number;
  [key: string]: any;
}

export interface Point {
  x: number;
  y: number;
}

export interface FloorPlanMetadata {
  createdAt?: string;
  updatedAt?: string;
  scale?: number;
  units?: 'meters' | 'feet';
  paperSize?: PaperSize | string;
  level?: number;
  [key: string]: any;
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width?: number;
}

export type StrokeTypeLiteral = 'line' | 'polyline' | 'wall' | 'room' | 'freehand';
export type StrokeType = StrokeTypeLiteral;
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}
