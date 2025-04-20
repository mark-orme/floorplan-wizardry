
/**
 * Typed test fixtures
 * Provides strongly-typed test data creation helpers
 * @module utils/test/typedTestFixtures
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Room, 
  Wall, 
  Stroke, 
  Point, 
  FloorPlanMetadata,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  PaperSize,
} from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { asStrokeType, asRoomType } from '@/utils/floorPlanAdapter/converters';

// Export types used in tests
export type { FloorPlan, Stroke, Wall, Room, Point, StrokeTypeLiteral, RoomTypeLiteral };
export { asStrokeType, asRoomType, PaperSize, createCompleteMetadata };

/**
 * Creates a test point
 * @param overrides Properties to override defaults
 * @returns Test point
 */
export const createTestPoint = (overrides: Partial<Point> = {}): Point => {
  return {
    x: overrides.x ?? 0,
    y: overrides.y ?? 0
  };
};

/**
 * Creates a test stroke with valid type
 * @param overrides Properties to override defaults
 * @returns Test stroke
 */
export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: overrides.id ?? uuidv4(),
    points: overrides.points ?? [createTestPoint(), createTestPoint({ x: 100, y: 100 })],
    type: overrides.type ?? 'line' as StrokeTypeLiteral,
    thickness: overrides.thickness ?? 2,
    width: overrides.width ?? overrides.thickness ?? 2,
    color: overrides.color ?? '#000000'
  };
};

/**
 * Creates a test wall
 * @param overrides Properties to override defaults
 * @returns Test wall
 */
export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = overrides.start ?? createTestPoint();
  const end = overrides.end ?? createTestPoint({ x: 100, y: 0 });
  
  // Calculate length if not provided
  const length = overrides.length ?? Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  return {
    id: overrides.id ?? uuidv4(),
    start,
    end,
    thickness: overrides.thickness ?? 10,
    length,
    color: overrides.color ?? '#000000',
    roomIds: overrides.roomIds ?? [],
    height: overrides.height
  };
};

/**
 * Creates a test room
 * @param overrides Properties to override defaults
 * @returns Test room
 */
export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  const vertices = overrides.vertices ?? [
    createTestPoint(),
    createTestPoint({ x: 100, y: 0 }),
    createTestPoint({ x: 100, y: 100 }),
    createTestPoint({ x: 0, y: 100 })
  ];
  
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? 'Test Room',
    type: overrides.type ?? 'other' as RoomTypeLiteral,
    area: overrides.area ?? 0,
    vertices,
    perimeter: overrides.perimeter ?? 400,
    labelPosition: overrides.labelPosition ?? createTestPoint({ x: 50, y: 50 }),
    center: overrides.center ?? createTestPoint({ x: 50, y: 50 }),
    color: overrides.color ?? '#ffffff'
  };
};

/**
 * Creates a complete test floor plan with all required properties
 * @param overrides Properties to override defaults
 * @returns Test floor plan
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  const level = overrides.level ?? 0;
  
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? 'Test Floor Plan',
    label: overrides.label ?? 'Test Floor Plan',
    walls: overrides.walls ?? [],
    rooms: overrides.rooms ?? [],
    strokes: overrides.strokes ?? [],
    canvasData: overrides.canvasData ?? null,
    canvasJson: overrides.canvasJson ?? null,
    canvasState: overrides.canvasState ?? null,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    gia: overrides.gia ?? 0,
    level: level,
    index: overrides.index ?? level,
    metadata: overrides.metadata ?? createCompleteMetadata({
      level
    }),
    data: overrides.data ?? {},
    userId: overrides.userId ?? 'test-user'
  };
};
