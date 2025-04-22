
/**
 * Basic types for floor plans
 * Re-exports from unifiedTypes for backward compatibility
 * @module types/floor-plan/basicTypes
 */

import {
  PaperSize,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  createEmptyFloorPlan
} from './unifiedTypes';

// Re-export enums and types
export { PaperSize };
export type { Point, StrokeTypeLiteral, RoomTypeLiteral, FloorPlanMetadata };

/**
 * Create a point with the given coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Create a complete metadata object with all required fields
 */
export function createCompleteMetadata(partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || PaperSize.A4,
    level: partial.level || 0,
    version: partial.version || '1.0',
    author: partial.author || 'System',
    notes: partial.notes || '',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now
  };
}
