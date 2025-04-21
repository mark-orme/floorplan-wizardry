
/**
 * Type diagnostics for validating object structures
 * @module utils/debug/typeDiagnostics
 */
import type { FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import type { Point } from '@/types/core/Point';
import type { FloorPlanMetadata } from '@/types/floor-plan/basicTypes';
import { PaperSize } from '@/types/floor-plan/basicTypes';

/**
 * Validates a Point object
 * @param point Object to validate
 * @returns True if valid Point object
 */
export function validatePoint(point: any): boolean {
  return (
    point !== null &&
    typeof point === 'object' &&
    typeof point.x === 'number' &&
    typeof point.y === 'number'
  );
}

/**
 * Validates a Stroke object
 * @param stroke Object to validate
 * @returns True if valid Stroke object
 */
export function validateStroke(stroke: any): boolean {
  return (
    stroke !== null &&
    typeof stroke === 'object' &&
    typeof stroke.id === 'string' &&
    Array.isArray(stroke.points) &&
    stroke.points.every((p: any) => validatePoint(p)) &&
    typeof stroke.color === 'string' &&
    typeof stroke.thickness === 'number'
  );
}

/**
 * Validates a Wall object
 * @param wall Object to validate
 * @returns True if valid Wall object
 */
export function validateWall(wall: any): boolean {
  return (
    wall !== null &&
    typeof wall === 'object' &&
    typeof wall.id === 'string' &&
    validatePoint(wall.start) &&
    validatePoint(wall.end) &&
    typeof wall.thickness === 'number' &&
    typeof wall.length === 'number' &&
    typeof wall.color === 'string' &&
    Array.isArray(wall.roomIds)
  );
}

/**
 * Validates a Room object
 * @param room Object to validate
 * @returns True if valid Room object
 */
export function validateRoom(room: any): boolean {
  return (
    room !== null &&
    typeof room === 'object' &&
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    typeof room.type === 'string' &&
    Array.isArray(room.vertices) &&
    room.vertices.every((p: any) => validatePoint(p)) &&
    typeof room.area === 'number' &&
    typeof room.perimeter === 'number' &&
    validatePoint(room.center) &&
    validatePoint(room.labelPosition) &&
    typeof room.color === 'string'
  );
}

/**
 * Validates a FloorPlan object
 * @param floorPlan Object to validate
 * @returns True if valid FloorPlan object
 */
export function validateFloorPlan(floorPlan: any): boolean {
  return (
    floorPlan !== null &&
    typeof floorPlan === 'object' &&
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    Array.isArray(floorPlan.walls) &&
    floorPlan.walls.every((w: any) => validateWall(w)) &&
    Array.isArray(floorPlan.rooms) &&
    floorPlan.rooms.every((r: any) => validateRoom(r)) &&
    Array.isArray(floorPlan.strokes) &&
    floorPlan.strokes.every((s: any) => validateStroke(s)) &&
    typeof floorPlan.createdAt === 'string' &&
    typeof floorPlan.updatedAt === 'string'
  );
}

/**
 * Calculate wall length from start and end points
 * @param start Start point
 * @param end End point
 * @returns Wall length
 */
export function calculateWallLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create a complete floor plan metadata object
 * @param partial Partial metadata
 * @returns Complete metadata
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
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now,
    notes: partial.notes || ''
  };
}
