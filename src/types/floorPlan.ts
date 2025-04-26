
/**
 * Floor Plan Types
 * Type definitions for floor plan functionality
 * @module types/floorPlan
 */

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height?: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface Room {
  id: string;
  name: string;
  walls: string[]; // IDs of walls
  area?: number; // m²
  color?: string;
  metadata?: Record<string, any>;
}

export interface Furniture {
  id: string;
  type: string;
  position: Point;
  rotation: number;
  width: number;
  depth: number;
  height?: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface Dimension {
  id: string;
  start: Point;
  end: Point;
  value: number; // length in mm
  metadata?: Record<string, any>;
}

export interface FloorPlanLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: string[]; // IDs of objects on this layer
}

export interface FloorPlan {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  walls: Wall[];
  rooms: Room[];
  furniture: Furniture[];
  dimensions: Dimension[];
  layers: FloorPlanLayer[];
  scale: number; // pixels per meter
  width: number; // in pixels
  height: number; // in pixels
  backgroundColor?: string;
  metadata?: Record<string, any>;
}
