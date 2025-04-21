
/**
 * Floor plan validation service
 * Domain logic for validating floor plans and geometry
 * @module packages/floorplan-core/services/validationService
 */

import { Point, Polygon } from '@/types/core/Geometry';
import { Wall, Room, FloorPlan } from '@/types/core/floor-plan';
import { calculatePolygonArea, isPolygonClosed, validatePolygon } from '@/utils/geometry/engine';

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors if any */
  errors: string[];
  /** Validation warnings if any */
  warnings: string[];
}

/**
 * Validate a wall object
 * @param wall Wall to validate
 * @returns Validation result
 */
export function validateWall(wall: Wall): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if start and end points are the same
  if (wall.start.x === wall.end.x && wall.start.y === wall.end.y) {
    errors.push('Wall has zero length');
  }
  
  // Check if wall has a valid thickness
  if (wall.thickness <= 0) {
    errors.push('Wall thickness must be greater than zero');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a room polygon
 * @param room Room to validate
 * @returns Validation result
 */
export function validateRoom(room: Room): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if room has at least 3 points
  if (room.points.length < 3) {
    errors.push('Room must have at least 3 points');
    return {
      valid: false,
      errors,
      warnings
    };
  }
  
  // Check if room polygon is closed
  if (!isPolygonClosed(room.points)) {
    warnings.push('Room polygon is not closed');
  }
  
  // Check if room has a valid area
  const area = calculatePolygonArea(room.points);
  if (area < 0.01) {
    errors.push('Room has near-zero area');
  }
  
  // Check if room has a valid name
  if (!room.name || room.name.trim() === '') {
    warnings.push('Room has no name');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a floor plan
 * @param floorPlan Floor plan to validate
 * @returns Validation result
 */
export function validateFloorPlan(floorPlan: FloorPlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if floor plan has a valid name
  if (!floorPlan.name || floorPlan.name.trim() === '') {
    warnings.push('Floor plan has no name');
  }
  
  // Validate all walls
  for (let i = 0; i < floorPlan.walls.length; i++) {
    const result = validateWall(floorPlan.walls[i]);
    if (!result.valid) {
      errors.push(`Wall #${i + 1}: ${result.errors.join(', ')}`);
    }
    result.warnings.forEach(warning => {
      warnings.push(`Wall #${i + 1}: ${warning}`);
    });
  }
  
  // Validate all rooms
  for (let i = 0; i < floorPlan.rooms.length; i++) {
    const result = validateRoom(floorPlan.rooms[i]);
    if (!result.valid) {
      errors.push(`Room #${i + 1}: ${result.errors.join(', ')}`);
    }
    result.warnings.forEach(warning => {
      warnings.push(`Room #${i + 1}: ${warning}`);
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
