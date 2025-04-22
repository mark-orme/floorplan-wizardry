
/**
 * Core floor plan type definitions
 * @module types/core/floor-plan/FloorPlan
 */
import { Point } from 'fabric';

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  roomIds: string[];
}

export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other';

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  area: number;
  color: string;
  wallIds?: string[];
}

export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  width: number;
  color?: string;
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  author?: string;
  version?: string;
  paperSize?: string;
  level?: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: FloorPlanMetadata;
}
