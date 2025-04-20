/**
 * Type diagnostics utilities
 * @module utils/debug/typeDiagnostics
 */
import { FloorPlan, Room, Wall, Stroke, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';

/**
 * Check if a floor plan is structurally valid
 * @param floorPlan Floor plan to check
 * @returns True if valid
 */
export const isValidFloorPlan = (floorPlan: any): floorPlan is FloorPlan => {
  if (!floorPlan || typeof floorPlan !== 'object') return false;
  
  // Check essential properties
  return (
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    Array.isArray(floorPlan.walls) &&
    Array.isArray(floorPlan.rooms) &&
    Array.isArray(floorPlan.strokes) &&
    typeof floorPlan.metadata === 'object'
  );
};

/**
 * Check if a room is structurally valid
 * @param room Room to check
 * @returns True if valid
 */
export const isValidRoom = (room: any): room is Room => {
  if (!room || typeof room !== 'object') return false;
  
  // Check essential properties
  return (
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    typeof room.area === 'number' &&
    Array.isArray(room.vertices) &&
    room.vertices.every((v: any) => typeof v.x === 'number' && typeof v.y === 'number')
  );
};

/**
 * Check if a wall is structurally valid
 * @param wall Wall to check
 * @returns True if valid
 */
export const isValidWall = (wall: any): wall is Wall => {
  if (!wall || typeof wall !== 'object') return false;
  
  // Check essential properties
  return (
    typeof wall.id === 'string' &&
    typeof wall.thickness === 'number' &&
    typeof wall.length === 'number' &&
    typeof wall.start === 'object' &&
    typeof wall.end === 'object' &&
    typeof wall.start.x === 'number' &&
    typeof wall.start.y === 'number' &&
    typeof wall.end.x === 'number' &&
    typeof wall.end.y === 'number' &&
    Array.isArray(wall.roomIds)
  );
};

/**
 * Check if a stroke is structurally valid
 * @param stroke Stroke to check
 * @returns True if valid
 */
export const isValidStroke = (stroke: any): stroke is Stroke => {
  if (!stroke || typeof stroke !== 'object') return false;
  
  // Check essential properties
  return (
    typeof stroke.id === 'string' &&
    typeof stroke.thickness === 'number' &&
    Array.isArray(stroke.points) &&
    stroke.points.every((p: any) => typeof p.x === 'number' && typeof p.y === 'number')
  );
};

/**
 * Calculate wall length from start and end points
 * @param start Start point
 * @param end End point
 * @returns Wall length
 */
export const calculateWallLength = (start: { x: number; y: number }, end: { x: number; y: number }): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Validate a floor plan and report any issues
 * @param floorPlan Floor plan to validate
 * @returns Validation result
 */
export const validateFloorPlanWithReporting = (floorPlan: any): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!floorPlan) {
    issues.push('Floor plan is null or undefined');
    return { valid: false, issues };
  }
  
  if (typeof floorPlan !== 'object') {
    issues.push('Floor plan is not an object');
    return { valid: false, issues };
  }
  
  // Check essential properties
  if (typeof floorPlan.id !== 'string') issues.push('Floor plan ID is not a string');
  if (typeof floorPlan.name !== 'string') issues.push('Floor plan name is not a string');
  
  // Check arrays
  if (!Array.isArray(floorPlan.walls)) {
    issues.push('Floor plan walls is not an array');
  } else {
    floorPlan.walls.forEach((wall: any, idx: number) => {
      if (!isValidWall(wall)) {
        issues.push(`Wall at index ${idx} is invalid`);
      }
    });
  }
  
  if (!Array.isArray(floorPlan.rooms)) {
    issues.push('Floor plan rooms is not an array');
  } else {
    floorPlan.rooms.forEach((room: any, idx: number) => {
      if (!isValidRoom(room)) {
        issues.push(`Room at index ${idx} is invalid`);
      }
    });
  }
  
  if (!Array.isArray(floorPlan.strokes)) {
    issues.push('Floor plan strokes is not an array');
  } else {
    floorPlan.strokes.forEach((stroke: any, idx: number) => {
      if (!isValidStroke(stroke)) {
        issues.push(`Stroke at index ${idx} is invalid`);
      }
    });
  }
  
  // Check metadata
  if (typeof floorPlan.metadata !== 'object' || !floorPlan.metadata) {
    issues.push('Floor plan metadata is missing or invalid');
  } else {
    const metadata = floorPlan.metadata;
    if (typeof metadata.version !== 'string') issues.push('Metadata version is not a string');
    if (typeof metadata.author !== 'string') issues.push('Metadata author is not a string');
    if (typeof metadata.dateCreated !== 'string') issues.push('Metadata dateCreated is not a string');
    if (typeof metadata.lastModified !== 'string') issues.push('Metadata lastModified is not a string');
    if (typeof metadata.notes !== 'string') issues.push('Metadata notes is not a string');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Log detailed type information for debugging
 * @param obj Object to log
 * @param label Optional label
 */
export const logTypeInfo = (obj: any, label: string = 'Object'): void => {
  console.group(`Type info for ${label}`);
  console.log('Value:', obj);
  console.log('Type:', typeof obj);
  
  if (obj === null) {
    console.log('Is null: true');
  } else if (typeof obj === 'object') {
    console.log('Keys:', Object.keys(obj));
    console.log('Is array:', Array.isArray(obj));
    
    if (Array.isArray(obj)) {
      console.log('Array length:', obj.length);
      if (obj.length > 0) {
        console.log('First item type:', typeof obj[0]);
      }
    }
  }
  
  console.groupEnd();
};

/**
 * Create a complete metadata object with all required fields
 * @param overrides Optional property overrides
 * @returns Complete FloorPlanMetadata object
 */
export const createCompleteMetadata = (overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata => {
  const now = new Date().toISOString();
  
  return {
    version: overrides.version ?? "1.0",
    author: overrides.author ?? "Test User",
    dateCreated: overrides.dateCreated ?? now,
    lastModified: overrides.lastModified ?? now,
    notes: overrides.notes ?? "",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    paperSize: overrides.paperSize ?? "A4",
    level: overrides.level ?? 0
  };
};
