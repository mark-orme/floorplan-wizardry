
/**
 * Floor Plan types definition
 * This file contains type definitions for the floor plan feature
 */

export interface Point {
  x: number;
  y: number;
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter'
}

export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';
export type StrokeType = StrokeTypeLiteral;

export type RoomTypeLiteral = 'kitchen' | 'bathroom' | 'bedroom' | 'living' | 'dining' | 'office' | 'hallway' | 'other';
export type RoomType = RoomTypeLiteral;

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

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width?: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string;
  area: number;
  level?: number;
  walls?: string[]; // Make walls optional but required in imports
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: string;
  level: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  canvasData: any | null;
  canvasJson: any | null;
  metadata: FloorPlanMetadata;
}
