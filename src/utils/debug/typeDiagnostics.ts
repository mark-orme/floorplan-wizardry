
/**
 * Type diagnostics utility
 * @module utils/debug/typeDiagnostics
 */
import { PaperSize, FloorPlanMetadata, FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';

/**
 * Calculate wall length based on start and end points
 * @param start Start point
 * @param end End point
 * @returns Length of wall
 */
export function calculateWallLength(start: {x: number, y: number}, end: {x: number, y: number}): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create a complete metadata object with all required fields
 * @param overrides Properties to override defaults
 * @returns Complete metadata object
 */
export function createCompleteMetadata(overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    paperSize: overrides.paperSize || PaperSize.A4,
    level: overrides.level ?? 0,
    // Add the missing fields required by FloorPlanMetadata
    version: overrides.version || '1.0',
    author: overrides.author || '',
    dateCreated: overrides.dateCreated || now,
    lastModified: overrides.lastModified || now,
    notes: overrides.notes || ''
  };
}

/**
 * Validates a floor plan and reports any issues
 * @param floorPlan The floor plan to validate
 * @returns Validation result with issues if any
 */
export function validateFloorPlanWithReporting(floorPlan: FloorPlan): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!floorPlan) {
    return { valid: false, issues: ['Floor plan is null or undefined'] };
  }
  
  if (!floorPlan.id) {
    issues.push('Missing floor plan ID');
  }
  
  if (!floorPlan.name) {
    issues.push('Missing floor plan name');
  }
  
  if (!floorPlan.metadata) {
    issues.push('Missing floor plan metadata');
  } else {
    if (!floorPlan.metadata.version) {
      issues.push('Missing metadata version');
    }
    if (!floorPlan.metadata.author) {
      issues.push('Missing metadata author');
    }
    // More metadata validations if needed
  }
  
  // Validate walls
  if (!Array.isArray(floorPlan.walls)) {
    issues.push('Walls property is not an array');
  } else {
    floorPlan.walls.forEach((wall, index) => {
      if (!wall.id) {
        issues.push(`Wall at index ${index} is missing an ID`);
      }
      if (!wall.start || typeof wall.start.x !== 'number' || typeof wall.start.y !== 'number') {
        issues.push(`Wall at index ${index} has invalid start point`);
      }
      if (!wall.end || typeof wall.end.x !== 'number' || typeof wall.end.y !== 'number') {
        issues.push(`Wall at index ${index} has invalid end point`);
      }
    });
  }
  
  // Validate rooms
  if (!Array.isArray(floorPlan.rooms)) {
    issues.push('Rooms property is not an array');
  } else {
    floorPlan.rooms.forEach((room, index) => {
      if (!room.id) {
        issues.push(`Room at index ${index} is missing an ID`);
      }
      if (!room.name) {
        issues.push(`Room at index ${index} is missing a name`);
      }
      if (!Array.isArray(room.vertices) || room.vertices.length < 3) {
        issues.push(`Room at index ${index} has invalid vertices (less than 3 points)`);
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate if a floor plan is valid
 * @param floorPlan Floor plan to validate
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: FloorPlan): boolean {
  return floorPlan && 
         typeof floorPlan.id === 'string' && 
         typeof floorPlan.name === 'string';
}

/**
 * Validate if a room is valid
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function isValidRoom(room: Room): boolean {
  return room && 
         typeof room.id === 'string' && 
         typeof room.name === 'string' && 
         Array.isArray(room.vertices) && 
         room.vertices.length >= 3;
}

/**
 * Validate if a wall is valid
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: Wall): boolean {
  return wall && 
         typeof wall.id === 'string' && 
         wall.start && 
         typeof wall.start.x === 'number' && 
         typeof wall.start.y === 'number' && 
         wall.end && 
         typeof wall.end.x === 'number' && 
         typeof wall.end.y === 'number';
}

/**
 * Validate if a stroke is valid
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function isValidStroke(stroke: Stroke): boolean {
  return stroke && 
         typeof stroke.id === 'string' && 
         Array.isArray(stroke.points) && 
         stroke.points.length > 0;
}

/**
 * Log type information for debugging
 * @param obj Object to log
 * @param label Optional label
 */
export function logTypeInfo(obj: any, label: string = 'Object'): void {
  console.group(`Type Info: ${label}`);
  console.log('Type:', typeof obj);
  console.log('Constructor:', obj?.constructor?.name);
  console.log('Keys:', Object.keys(obj || {}));
  console.log('Value:', obj);
  console.groupEnd();
}

// Export all validation functions
export {
  validateFloorPlanWithReporting,
  isValidFloorPlan,
  isValidRoom,
  isValidWall,
  isValidStroke,
  createCompleteMetadata
};
