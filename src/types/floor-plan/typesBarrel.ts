
/**
 * Floor Plan Types Barrel
 * Central export file for all floor plan related types
 * @module types/floor-plan/typesBarrel
 */

// Re-export from individual type files
export * from './wallTypes';
export * from './strokeTypes';
export * from './roomTypes';
export * from './metadataTypes';
export * from './floorPlanTypes';
export * from './basicTypes';

// Export Point type (needed for geometry)
export interface Point {
  x: number;
  y: number;
}

// Type validation utilities to ensure consistency
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  if (!validTypes.includes(type as StrokeTypeLiteral)) {
    console.warn(`Invalid stroke type: ${type}, defaulting to 'line'`);
    return 'line';
  }
  
  return type as StrokeTypeLiteral;
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  if (!validTypes.includes(type as RoomTypeLiteral)) {
    console.warn(`Invalid room type: ${type}, defaulting to 'other'`);
    return 'other';
  }
  
  return type as RoomTypeLiteral;
}

// Create validation functions for each type
export function validateFloorPlan(floorPlan: any): boolean {
  if (!floorPlan) return false;
  if (!floorPlan.id) return false;
  if (!floorPlan.data) return false;
  if (!floorPlan.userId) return false;
  return true;
}

export function validateRoom(room: any): boolean {
  if (!room) return false;
  if (!room.id) return false;
  if (!room.type) return false;
  try {
    asRoomType(room.type);
  } catch (e) {
    return false;
  }
  return true;
}

export function validateStroke(stroke: any): boolean {
  if (!stroke) return false;
  if (!stroke.id) return false;
  if (!stroke.type) return false;
  try {
    asStrokeType(stroke.type);
  } catch (e) {
    return false;
  }
  return true;
}

export function validateWall(wall: any): boolean {
  if (!wall) return false;
  if (!wall.id) return false;
  if (!wall.roomIds) return false;
  return true;
}
