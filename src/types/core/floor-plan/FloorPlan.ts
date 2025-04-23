/**
 * Core floor plan type definitions
 * @module types/core/floor-plan/FloorPlan
 */
import { Point } from '../Point';
import { PaperSize } from './PaperSize';

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

/**
 * Creates a new floor plan with default values
 */
export function createFloorPlan(id: string, name: string): any {
  const now = new Date().toISOString();
  
  return {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    walls: [],
    rooms: [],
    strokes: [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0
    }
  };
}
