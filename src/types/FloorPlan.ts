import { DrawingMode } from '@/constants/drawingModes';

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  index: number;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  gia: number;
  level: number;
  canvasData: CanvasData | null;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: FloorPlanMetadata;
  data: any; // Required for interface compatibility
  userId: string; // Required for interface compatibility
}

export interface Room {
  id: string;
  name: string;
  floorPlanId: string;
  area: number;
  perimeter: number;
  center: Point;
  vertices: Point[];
  labelPosition: Point;
  createdAt: string;
  updatedAt: string;
  metadata: RoomMetadata;
}

export interface Wall {
  id: string;
  floorPlanId: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  angle: number;
  createdAt: string;
  updatedAt: string;
  metadata: WallMetadata;
}

export interface Stroke {
  id: string;
  floorPlanId: string;
  points: Point[];
  color: string;
  thickness: number;
  drawingMode: DrawingMode;
  createdAt: string;
  updatedAt: string;
  metadata: StrokeMetadata;
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasData {
  zoom: number;
  offset: Point;
}

export interface FloorPlanMetadata {
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}

export interface RoomMetadata {
  type: string;
  material: string;
  notes: string;
}

export interface WallMetadata {
  type: string;
  material: string;
  height: number;
  notes: string;
}

export interface StrokeMetadata {
  type: string;
  notes: string;
}
