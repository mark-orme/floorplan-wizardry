
/**
 * Room definitions for floor plans
 * @module types/core/floor-plan/Room
 */

import { Point } from '../Point';
import { v4 as uuidv4 } from 'uuid';

/**
 * Room type enum
 */
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomType;
  
  /** Room area in square meters */
  area: number;
  
  /** Boundary points */
  points: Point[];
  
  /** Fill color */
  color: string;
  
  /** Floor level this room belongs to */
  level: number;
  
  /** Wall IDs associated with this room */
  walls: string[];
}

/**
 * Calculate polygon area using the shoelace formula
 * @param points Array of points forming the polygon
 * @returns Area of the polygon
 */
function calculateArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Create a room with the specified properties
 * @param options Room properties
 * @returns A new Room object
 */
export function createRoom(options: {
  id?: string;
  name?: string;
  type?: RoomType;
  points: Point[];
  color?: string;
  level?: number;
  walls?: string[];
}): Room {
  const area = calculateArea(options.points);
  
  return {
    id: options.id || uuidv4(),
    name: options.name || 'Unnamed Room',
    type: options.type || 'other',
    area,
    points: options.points,
    color: options.color || '#ffffff',
    level: options.level || 0,
    walls: options.walls || []
  };
}
