
/**
 * Floor Plan Types Barrel
 * Central export file for all floor plan related types
 * @module types/floor-plan/typesBarrel
 */

// Export from individual type files
export * from './wallTypes';
export * from './strokeTypes';
export * from './metadataTypes';
export * from './floorPlanTypes';
export * from './basicTypes';

// Export Point type (needed for geometry)
export interface Point {
  x: number;
  y: number;
}

// Export type validation functions
export { asStrokeType, asRoomType } from '@/utils/test/typeGaurd';

// Create validation functions for types to avoid circular dependencies
export function validateFloorPlan(floorPlan: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!floorPlan) {
    return { valid: false, errors: ['FloorPlan is null or undefined'] };
  }
  
  // Check required properties
  if (!floorPlan.id) errors.push('Missing id property');
  if (!floorPlan.data) errors.push('Missing data property'); 
  if (!floorPlan.userId) errors.push('Missing userId property');
  if (!floorPlan.walls) errors.push('Missing walls property');
  if (!floorPlan.rooms) errors.push('Missing rooms property');
  if (!floorPlan.strokes) errors.push('Missing strokes property');
  
  return { valid: errors.length === 0, errors };
}

export function validateRoom(room: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!room) {
    return { valid: false, errors: ['Room is null or undefined'] };
  }
  
  // Check required properties
  if (!room.id) errors.push('Missing id property');
  if (!room.type) errors.push('Missing type property');
  if (!room.walls) errors.push('Missing walls property');
  
  // Ensure type is a valid RoomTypeLiteral
  if (room.type && typeof room.type === 'string') {
    try {
      asRoomType(room.type);
    } catch (e) {
      errors.push(`Invalid room type: ${room.type}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateStroke(stroke: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!stroke) {
    return { valid: false, errors: ['Stroke is null or undefined'] };
  }
  
  // Check required properties
  if (!stroke.id) errors.push('Missing id property');
  if (!stroke.type) errors.push('Missing type property');
  
  // Ensure type is a valid StrokeTypeLiteral
  if (stroke.type && typeof stroke.type === 'string') {
    try {
      asStrokeType(stroke.type);
    } catch (e) {
      errors.push(`Invalid stroke type: ${stroke.type}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateWall(wall: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!wall) {
    return { valid: false, errors: ['Wall is null or undefined'] };
  }
  
  // Check required properties
  if (!wall.id) errors.push('Missing id property');
  if (!wall.roomIds) errors.push('Missing roomIds property');
  
  return { valid: errors.length === 0, errors };
}

// Don't re-export RoomTypeLiteral separately to avoid ambiguity
// export { RoomTypeLiteral } from './roomTypes';
