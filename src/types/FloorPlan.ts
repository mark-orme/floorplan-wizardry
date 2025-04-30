
/**
 * Floor plan types
 * @module types/FloorPlan
 */
import { Point } from './fabric-unified';

export interface FloorPlan {
  id: string;
  name: string;
  width: number;
  height: number;
  level?: number;
  updatedAt: string;
  label?: string;
  walls?: any[];
  rooms?: any[];
  strokes?: any[];
  data?: Record<string, any>;
}

export interface FloorPlanMetadata {
  name: string;
  created?: string;
  modified?: string;
  updated?: string;
  description?: string;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height?: number;
  color?: string;
  roomIds?: string[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  points: Point[];
  vertices: Point[];
  area: number;
  perimeter: number;
  center: Point;
  labelPosition: Point;
  color?: string;
}

export const createEmptyFloorPlan = (): FloorPlan => ({
  id: '',
  name: 'New Floor Plan',
  width: 1000,
  height: 800,
  level: 1,
  updatedAt: new Date().toISOString(),
  walls: [],
  rooms: [],
  strokes: [],
  data: {}
});
