
/**
 * Floor plan type definitions
 */

import { Point } from './core/Point';

// Basic shape types
export type StrokeType = 'line' | 'shape' | 'wall' | 'text';

// Stroke interface for drawing
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeType;
  color: string;
  thickness: number;
  width: number;
}

// Wall interface for architectural elements
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
}

// Room interface for enclosed spaces
export interface Room {
  id: string;
  name: string;
  wallIds: string[];
  area: number;
  color: string;
  type?: string;
}

// Floor plan interface
export interface FloorPlan {
  id: string;
  name: string;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  doors: any[]; // Could be expanded later
  windows: any[]; // Could be expanded later
  furniture: any[]; // Could be expanded later
  level: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create an empty floor plan
 */
export function createEmptyFloorPlan(): FloorPlan {
  return {
    id: generateId(),
    name: 'New Floor Plan',
    strokes: [],
    walls: [],
    rooms: [],
    doors: [],
    windows: [],
    furniture: [],
    level: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
