
/**
 * Unified floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */
import { Point } from 'fabric';
import { RoomTypeLiteral, StrokeTypeLiteral } from '../core/floor-plan/FloorPlan';

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  roomIds: string[];
  length: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  points: Point[];
  area: number;
  color: string;
  level: number;
  walls: string[];
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  width: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  author: string;
  version: string;
  paperSize?: string;
  level?: number;
}

export interface UnifiedFloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: FloorPlanMetadata;
  canvasData?: any;
  canvasJson?: string;
  createdAt?: string;
  updatedAt?: string;
  gia?: number;
  level?: number;
  index?: number;
}

export type FloorPlan = UnifiedFloorPlan;
