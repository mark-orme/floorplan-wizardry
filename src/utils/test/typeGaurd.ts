
/**
 * Type guard utilities for testing
 * Helps ensure proper typing of test fixtures
 * @module utils/test/typeGaurd
 */
import { 
  StrokeTypeLiteral, 
  RoomTypeLiteral,
  FloorPlan,
  Stroke,
  Room,
  Wall
} from '@/types/floor-plan/typesBarrel';

/**
 * Ensure a string is a valid StrokeTypeLiteral
 * @param type String value to check
 * @returns Properly typed StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'other'
  ];
  
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line'; // Default to 'line' if invalid
}

/**
 * Ensure a string is a valid RoomTypeLiteral
 * @param type String value to check
 * @returns Properly typed RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other'; // Default to 'other' if invalid
}

/**
 * Ensures a FloorPlan has all required properties
 * @param plan Partial FloorPlan to validate
 * @returns Fully typed FloorPlan with defaults for missing fields
 */
export function ensureFloorPlan(plan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  // Always provide required fields
  return {
    id: plan.id || `fp-${Date.now()}`,
    name: plan.name || 'Test Floor Plan',
    label: plan.label || 'Test Floor Plan',
    walls: plan.walls || [],
    rooms: plan.rooms || [],
    strokes: plan.strokes || [],
    canvasData: plan.canvasData || null,
    canvasJson: plan.canvasJson || null,
    createdAt: plan.createdAt || now,
    updatedAt: plan.updatedAt || now,
    gia: plan.gia || 0,
    level: plan.level || 0,
    index: plan.index || 0,
    // Critical required fields often missed
    data: plan.data || {},
    userId: plan.userId || 'test-user',
    metadata: plan.metadata || {
      id: plan.id || `md-${Date.now()}`,
      name: plan.name || 'Test Floor Plan',
      thumbnail: '',
      paperSize: 'A4',
      level: plan.level || 0,
      version: '1.0'
    }
  };
}

/**
 * Ensures a Stroke has all required properties with proper types
 * @param stroke Partial Stroke to validate
 * @returns Fully typed Stroke with defaults for missing fields
 */
export function ensureStroke(stroke: Partial<Stroke>): Stroke {
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    points: stroke.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: stroke.type ? asStrokeType(stroke.type.toString()) : 'line',
    color: stroke.color || '#000000',
    thickness: stroke.thickness || 2,
    width: stroke.width || 2
  };
}

/**
 * Ensures a Room has all required properties with proper types
 * @param room Partial Room to validate
 * @returns Fully typed Room with defaults for missing fields
 */
export function ensureRoom(room: Partial<Room>): Room {
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Test Room',
    type: room.type ? asRoomType(room.type.toString()) : 'other',
    points: room.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: room.color || '#ffffff',
    area: room.area || 10000,
    level: room.level || 0,
    walls: room.walls || []
  };
}

/**
 * Ensures a Wall has all required properties
 * @param wall Partial Wall to validate
 * @returns Fully typed Wall with defaults for missing fields
 */
export function ensureWall(wall: Partial<Wall>): Wall {
  const start = wall.start || { x: 0, y: 0 };
  const end = wall.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: wall.id || `wall-${Date.now()}`,
    start,
    end,
    points: wall.points || [start, end],
    thickness: wall.thickness || 5,
    color: wall.color || '#000000',
    roomIds: wall.roomIds || [], // Crucial - must be present
    length: wall.length || length
  };
}
