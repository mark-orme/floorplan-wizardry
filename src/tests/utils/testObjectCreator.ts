
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room, 
  Point, 
  StrokeTypeLiteral, 
  RoomTypeLiteral 
} from '@/types/floorPlanTypes';
import { 
  ensureFloorPlan, 
  ensureStroke, 
  ensureRoom,
  ensureWall,
  asStrokeType,
  asRoomType
} from '@/utils/test/typeGaurd';

/**
 * Creates a test stroke with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Stroke object
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  // Safely cast the type to ensure it's a valid StrokeTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asStrokeType(overrides.type);
  }
  
  return ensureStroke(overrides);
}

/**
 * Creates a test wall with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Wall object
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  // Ensure wall has roomIds property
  if (!overrides.roomIds) {
    overrides.roomIds = [];
  }
  
  return ensureWall(overrides);
}

/**
 * Creates a test room with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Room object
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  // Safely cast the type to ensure it's a valid RoomTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asRoomType(overrides.type);
  }
  
  return ensureRoom(overrides);
}

/**
 * Creates a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Creates a test floor plan with all required properties
 * @param overrides Optional properties to override defaults
 * @returns Properly typed FloorPlan object
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  // Ensure we have required fields
  if (!overrides.data) {
    overrides.data = {};
  }
  
  if (!overrides.userId) {
    overrides.userId = 'test-user';
  }
  
  return ensureFloorPlan(overrides);
}

/**
 * Creates a test floor plan metadata object with correct properties
 * @param overrides Optional properties to override defaults
 * @returns FloorPlanMetadata object
 */
export function createTestFloorPlanMetadata(overrides: Partial<any> = {}): any {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Floor Plan',
    thumbnail: overrides.thumbnail || '',
    paperSize: overrides.paperSize || 'A4',
    level: overrides.level || 0,
    version: overrides.version || '1.0',
    ...overrides
  };
}
