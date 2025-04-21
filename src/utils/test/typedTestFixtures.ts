
/**
 * Typed test fixtures
 * Provides test fixtures with proper type checking
 * @module utils/test/typedTestFixtures
 */
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan, Wall, Room, Stroke, Point } from '@/types/floor-plan/unifiedTypes';
import { PaperSize } from '@/types/floor-plan/unifiedTypes';
import { adaptWall, adaptRoom, adaptFloorPlan } from '@/utils/typeAdapters';

/**
 * Create a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Test point
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a test wall with all required properties
 * @param overrides Properties to override
 * @returns Test wall
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start ?? createTestPoint(0, 0);
  const end = overrides.end ?? createTestPoint(100, 0);
  
  return adaptWall({
    id: overrides.id ?? `test-wall-${uuidv4()}`,
    start,
    end,
    thickness: overrides.thickness ?? 2,
    color: overrides.color ?? '#000000',
    roomIds: overrides.roomIds ?? [],
    ...overrides
  });
}

/**
 * Create a test room with all required properties
 * @param overrides Properties to override
 * @returns Test room
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  const vertices = overrides.vertices ?? [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];
  
  return adaptRoom({
    id: overrides.id ?? `test-room-${uuidv4()}`,
    name: overrides.name ?? 'Test Room',
    type: overrides.type ?? 'other',
    area: overrides.area ?? 10000,
    perimeter: overrides.perimeter ?? 400,
    vertices,
    center: overrides.center ?? createTestPoint(50, 50),
    labelPosition: overrides.labelPosition ?? createTestPoint(50, 50),
    color: overrides.color ?? '#ffffff',
    level: overrides.level ?? 0,
    walls: overrides.walls ?? [],
    ...overrides
  });
}

/**
 * Create a test stroke with all required properties
 * @param overrides Properties to override
 * @returns Test stroke
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  const points = overrides.points ?? [
    createTestPoint(0, 0),
    createTestPoint(100, 100)
  ];
  
  return {
    id: overrides.id ?? `test-stroke-${uuidv4()}`,
    points,
    type: overrides.type ?? 'line',
    color: overrides.color ?? '#000000',
    thickness: overrides.thickness ?? 2,
    width: overrides.width ?? 2,
    ...overrides
  };
}

/**
 * Create a test floor plan with all required properties
 * @param overrides Properties to override
 * @returns Test floor plan
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return adaptFloorPlan({
    id: overrides.id ?? `test-floorplan-${uuidv4()}`,
    name: overrides.name ?? 'Test Floor Plan',
    label: overrides.label ?? 'Test Floor Plan',
    walls: overrides.walls ?? [],
    rooms: overrides.rooms ?? [],
    strokes: overrides.strokes ?? [],
    canvasData: overrides.canvasData ?? null,
    canvasJson: overrides.canvasJson ?? null,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    gia: overrides.gia ?? 0,
    level: overrides.level ?? 0,
    index: overrides.index ?? 0,
    metadata: overrides.metadata ?? {
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0
    },
    data: overrides.data ?? {},
    userId: overrides.userId ?? 'test-user',
    ...overrides
  });
}
