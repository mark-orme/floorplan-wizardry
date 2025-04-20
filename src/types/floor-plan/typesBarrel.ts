
/**
 * Floor Plan Types Barrel
 * Single source of truth for all floor plan types
 * @module types/floor-plan/typesBarrel
 */

// Import from the main floorPlanTypes.ts (our source of truth)
import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize,
  DrawingMode
} from '../floorPlanTypes';

// Re-export all types
export {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize,
  DrawingMode
};

// Type validation functions
export function isFloorPlan(obj: any): obj is FloorPlan {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.data === 'object';
}

export function isStroke(obj: any): obj is Stroke {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    Array.isArray(obj.points) &&
    typeof obj.color === 'string' &&
    typeof obj.thickness === 'number' &&
    typeof obj.width === 'number';
}

export function isRoom(obj: any): obj is Room {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.points) &&
    typeof obj.color === 'string' &&
    typeof obj.area === 'number';
}
