
import { FloorPlan, Room, Stroke, Wall } from '@/types/floor-plan/typesBarrel';
import { asRoomType, asStrokeType } from '@/types/floor-plan/typesBarrel';

export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || 'test-floor-plan',
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Label',
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
    strokes: overrides.strokes || [],
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    level: overrides.level || 0,
    index: overrides.index || 0,
    gia: overrides.gia || 0,
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    metadata: overrides.metadata || {
      version: '1.0',
      author: 'test-author',
      dateCreated: now,
      lastModified: now
    },
    ...overrides
  };
};

export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  // Handle the type field correctly to ensure it's a valid RoomTypeLiteral
  const typeStr = overrides.type || 'other';
  const validType = typeof typeStr === 'string' ? asRoomType(typeStr) : typeStr;
  
  return {
    id: overrides.id || 'test-room',
    name: overrides.name || 'Test Room',
    type: validType,
    points: overrides.points || [],
    walls: overrides.walls || [],
    color: overrides.color || '#ffffff',
    area: overrides.area !== undefined ? overrides.area : 0,
    level: overrides.level !== undefined ? overrides.level : 0,
    ...overrides
  };
};

export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  // Handle the type field correctly to ensure it's a valid StrokeTypeLiteral
  const typeStr = overrides.type || 'line';
  const validType = typeof typeStr === 'string' ? asStrokeType(typeStr) : typeStr;
  
  return {
    id: overrides.id || 'test-stroke',
    points: overrides.points || [],
    type: validType,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    width: overrides.width || 1,
    ...overrides
  };
};

export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 100 };
  
  return {
    id: overrides.id || 'test-wall',
    start,
    end,
    points: overrides.points || [start, end],
    thickness: overrides.thickness || 10,
    color: overrides.color || '#000000',
    length: overrides.length || 141.42,
    roomIds: overrides.roomIds || [],
    ...overrides
  };
};
