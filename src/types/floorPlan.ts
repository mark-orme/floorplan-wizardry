
/**
 * Unified floor plan type definitions
 * @module types/floorPlan
 */
import { Point } from './canvas';

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
  dateCreated?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: FloorPlanMetadata;
  // Add missing properties
  updatedAt: string;
  createdAt: string;
  level?: number;
  gia?: number;
  index?: number;
  canvasData?: any;
  canvasJson?: string | null;
  data?: any;
  userId?: string;
  propertyId?: string;
}

// Helper functions
export function createEmptyFloorPlan(id: string = crypto.randomUUID()): FloorPlan {
  return {
    id,
    name: 'New Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
}

export function createWall(start: Point, end: Point, thickness = 10, color = '#000000'): Wall {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: crypto.randomUUID(),
    start,
    end,
    thickness,
    color,
    roomIds: []
  };
}

// Type guards
export function isFloorPlan(obj: any): obj is FloorPlan {
  return obj && 
    typeof obj.id === 'string' &&
    Array.isArray(obj.walls) &&
    Array.isArray(obj.rooms) &&
    Array.isArray(obj.strokes);
}

// Export Point type for compatibility
export { Point };
