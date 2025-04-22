/**
 * Room Types
 * Room interface and related types for floor plans
 * @module types/floor-plan/roomTypes
 */
import { Point } from '../core/Point';

/**
 * Room type literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'dining' | 'other';

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area in square meters (required) */
  area: number;
  
  /** Room perimeter */
  perimeter: number;
  
  /** Room center point */
  center: Point;
  
  /** Room label position */
  labelPosition: Point;
  
  /** Room boundary points */
  points?: Point[];
  
  /** Room vertices (polygon corners) */
  vertices: Point[];
  
  /** Room color (required) */
  color: string;
  
  /** Floor level this room belongs to */
  level?: number;
  
  /** Wall IDs associated with this room (required for compatibility) */
  walls?: string[];
}

/**
 * Create a room with specified properties
 * @param options Room properties
 * @returns A new Room object
 */
export function createRoom(options: {
  id?: string;
  name?: string;
  type?: RoomTypeLiteral;
  points: Point[];
  color?: string;
  level?: number;
  walls?: string[];
}): Room {
  const { v4: uuidv4 } = require('uuid');
  
  // Calculate center point from points
  const center = {
    x: options.points.reduce((sum, p) => sum + p.x, 0) / options.points.length,
    y: options.points.reduce((sum, p) => sum + p.y, 0) / options.points.length
  };
  
  // Calculate perimeter
  const perimeter = calculatePerimeter(options.points);
  
  return {
    id: options.id || uuidv4(),
    name: options.name || 'Unnamed Room',
    type: options.type || 'other',
    area: calculateArea(options.points),
    perimeter: perimeter,
    points: options.points,
    vertices: [...options.points], // Clone the points array for vertices
    center: center,
    labelPosition: center, // Default to center
    color: options.color || '#ffffff',
    level: options.level || 0,
    walls: options.walls || []
  };
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
 * Calculate polygon perimeter
 * @param points Array of points forming the polygon
 * @returns Perimeter of the polygon
 */
function calculatePerimeter(points: Point[]): number {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
}
