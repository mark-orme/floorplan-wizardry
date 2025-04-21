
/**
 * Typed Test Fixtures
 * Provides test fixtures that ensure type compatibility
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
  PaperSize
} from '@/types/floor-plan/unifiedTypes';
import { adaptFloorPlan, adaptRoom, adaptWall, adaptMetadata } from '@/utils/typeAdapters';

/**
 * Create a test point for unit tests
 * @param x X coordinate (default 0)
 * @param y Y coordinate (default 0)
 * @returns A Point object
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a test wall with specified properties and all required fields
 * @param options Wall properties
 * @returns A valid Wall object
 */
export function createTestWall(options: Partial<Wall> = {}): Wall {
  const start = options.start ?? createTestPoint(0, 0);
  const end = options.end ?? createTestPoint(100, 0);
  
  return adaptWall({
    id: options.id ?? uuidv4(),
    start,
    end,
    thickness: options.thickness ?? 5,
    color: options.color ?? '#000000',
    ...options
  });
}

/**
 * Create a test room with specified properties and all required fields
 * @param options Room properties
 * @returns A valid Room object
 */
export function createTestRoom(options: Partial<Room> = {}): Room {
  const points = options.points ?? [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];
  
  return adaptRoom({
    id: options.id ?? uuidv4(),
    name: options.name ?? 'Test Room',
    type: options.type ?? 'other',
    area: options.area ?? 10000,
    points,
    color: options.color ?? '#ffffff',
    level: options.level ?? 0,
    walls: options.walls ?? [],
    ...options
  });
}

/**
 * Create a test stroke with specified properties and all required fields
 * @param options Stroke properties
 * @returns A valid Stroke object
 */
export function createTestStroke(options: Partial<Stroke> = {}): Stroke {
  const points = options.points ?? [
    createTestPoint(0, 0),
    createTestPoint(100, 100)
  ];
  
  return {
    id: options.id ?? uuidv4(),
    points,
    type: options.type ?? 'line',
    color: options.color ?? '#000000',
    thickness: options.thickness ?? 2,
    width: options.width ?? options.thickness ?? 2,
    ...options
  };
}

/**
 * Create a test floor plan with complete metadata and required fields
 * @param options Floor plan properties
 * @returns A valid FloorPlan object
 */
export function createTestFloorPlan(options: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  const metadata = adaptMetadata({
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
    paperSize: PaperSize.A4,
    level: options.level ?? 0,
    version: '1.0',
    author: 'Test Author',
    dateCreated: now,
    lastModified: now,
    notes: 'Test floor plan for unit tests',
    ...options.metadata
  });

  return adaptFloorPlan({
    id: options.id ?? uuidv4(),
    name: options.name ?? 'Test Floor Plan',
    label: options.label ?? options.name ?? 'Test Floor Plan',
    walls: options.walls ?? [],
    rooms: options.rooms ?? [],
    strokes: options.strokes ?? [],
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
    gia: options.gia ?? 0,
    level: options.level ?? 0,
    index: options.index ?? options.level ?? 0,
    canvasData: options.canvasData ?? null,
    canvasJson: options.canvasJson ?? null,
    metadata,
    data: options.data ?? {},
    userId: options.userId ?? 'test-user',
    ...options
  });
}

/**
 * Type safe way to cast a string to StrokeTypeLiteral
 * @param type String to cast
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return (validTypes.includes(type as StrokeTypeLiteral) ? type : 'line') as StrokeTypeLiteral;
}

/**
 * Type safe way to cast a string to RoomTypeLiteral
 * @param type String to cast
 * @returns Valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return (validTypes.includes(type as RoomTypeLiteral) ? type : 'other') as RoomTypeLiteral;
}

// Re-export types for convenience
export type { FloorPlan, Room, Wall, Stroke, Point, FloorPlanMetadata, StrokeTypeLiteral, RoomTypeLiteral };
export { PaperSize };
