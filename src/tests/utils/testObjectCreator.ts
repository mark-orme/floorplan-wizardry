
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

/**
 * Creates a test stroke with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Stroke object
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: (overrides.type as StrokeTypeLiteral) || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2
  };
}

/**
 * Creates a test wall with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Wall object
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || uuidv4(),
    start: start,
    end: end,
    points: overrides.points || [start, end],
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length
  };
}

/**
 * Creates a test room with proper typing
 * @param overrides Optional properties to override defaults
 * @returns Properly typed Room object
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Room',
    type: (overrides.type as RoomTypeLiteral) || 'other',
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || []
  };
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
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || 0,
    metadata: overrides.metadata || {
      id: overrides.id || uuidv4(),
      name: overrides.name || 'Test Floor Plan',
      thumbnail: '',
      paperSize: 'A4',
      level: 0,
      version: '1.0'
    },
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
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
