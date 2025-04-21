
/**
 * Type diagnostics utility
 * @module utils/debug/typeDiagnostics
 */
import { FloorPlan, Wall, Room, Stroke, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';

/**
 * Calculate wall length between two points
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
 * Validate that a wall has all required properties
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function validateWall(wall: any): boolean {
  if (!wall) return false;
  
  const hasRequiredProps = (
    'id' in wall &&
    'start' in wall &&
    'end' in wall &&
    'thickness' in wall &&
    'length' in wall &&
    'color' in wall &&
    'roomIds' in wall
  );
  
  if (!hasRequiredProps) {
    console.warn('Wall missing required properties:', wall);
    return false;
  }
  
  return true;
}

/**
 * Validate that a room has all required properties
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function validateRoom(room: any): boolean {
  if (!room) return false;
  
  const hasRequiredProps = (
    'id' in room &&
    'name' in room &&
    'type' in room &&
    'area' in room &&
    'perimeter' in room &&
    'vertices' in room &&
    'labelPosition' in room &&
    'center' in room
  );
  
  if (!hasRequiredProps) {
    console.warn('Room missing required properties:', room);
    return false;
  }
  
  return true;
}

/**
 * Validate that a floor plan has all required properties
 * @param floorPlan Floor plan to validate
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlan(floorPlan: any): boolean {
  if (!floorPlan) return false;
  
  const hasRequiredProps = (
    'id' in floorPlan &&
    'name' in floorPlan &&
    'label' in floorPlan &&
    'walls' in floorPlan &&
    'rooms' in floorPlan &&
    'strokes' in floorPlan &&
    'metadata' in floorPlan &&
    'data' in floorPlan &&
    'userId' in floorPlan
  );
  
  if (!hasRequiredProps) {
    console.warn('Floor plan missing required properties:', floorPlan);
    return false;
  }
  
  return true;
}

/**
 * Validate that a stroke has all required properties
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function validateStroke(stroke: any): boolean {
  if (!stroke) return false;
  
  const hasRequiredProps = (
    'id' in stroke &&
    'points' in stroke &&
    'type' in stroke &&
    'color' in stroke &&
    'thickness' in stroke
  );
  
  if (!hasRequiredProps) {
    console.warn('Stroke missing required properties:', stroke);
    return false;
  }
  
  return true;
}

/**
 * Create a complete floor plan metadata object
 * @param partialMetadata Partial metadata
 * @returns Complete metadata
 */
export function createCompleteMetadata(partialMetadata: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    version: partialMetadata.version || '1.0.0',
    author: partialMetadata.author || 'Unknown',
    dateCreated: partialMetadata.dateCreated || now,
    lastModified: partialMetadata.lastModified || now,
    notes: partialMetadata.notes || '',
    createdAt: partialMetadata.createdAt || now,
    updatedAt: partialMetadata.updatedAt || now,
    paperSize: partialMetadata.paperSize || 'A4',
    level: partialMetadata.level || 0
  };
}

/**
 * Type guard for FloorPlan
 * @param value Value to check
 * @returns Whether value is a floor plan
 */
export function isFloorPlan(value: any): value is FloorPlan {
  return validateFloorPlan(value);
}

/**
 * Type guard for Room
 * @param value Value to check
 * @returns Whether value is a room
 */
export function isRoom(value: any): value is Room {
  return validateRoom(value);
}

/**
 * Type guard for Wall
 * @param value Value to check
 * @returns Whether value is a wall
 */
export function isWall(value: any): value is Wall {
  return validateWall(value);
}

/**
 * Type guard for Stroke
 * @param value Value to check
 * @returns Whether value is a stroke
 */
export function isStroke(value: any): value is Stroke {
  return validateStroke(value);
}

/**
 * Detailed validation for floor plans with reporting
 * @param floorPlan Floor plan to validate
 * @returns Validation results with issues list
 */
export function validateFloorPlanWithReporting(floorPlan: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!floorPlan) {
    issues.push('Floor plan is null or undefined');
    return { valid: false, issues };
  }
  
  // Check required properties
  if (!('id' in floorPlan)) issues.push('Missing id');
  if (!('name' in floorPlan)) issues.push('Missing name');
  if (!('label' in floorPlan)) issues.push('Missing label');
  if (!('walls' in floorPlan)) issues.push('Missing walls');
  if (!('rooms' in floorPlan)) issues.push('Missing rooms');
  if (!('strokes' in floorPlan)) issues.push('Missing strokes');
  if (!('metadata' in floorPlan)) issues.push('Missing metadata');
  if (!('data' in floorPlan)) issues.push('Missing data');
  if (!('userId' in floorPlan)) issues.push('Missing userId');
  
  return {
    valid: issues.length === 0,
    issues
  };
}
