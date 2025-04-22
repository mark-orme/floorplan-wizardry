
import { Point } from '@/types/core/Point';
import { Room, Wall, Stroke, FloorPlan, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test point for testing.
 * @param overrides Optional partial Point properties to override defaults
 * @returns Point object for testing
 */
export function createTestPoint(overrides: Partial<Point> = {}): Point {
  return {
    x: overrides.x !== undefined ? overrides.x : 0,
    y: overrides.y !== undefined ? overrides.y : 0
  };
}

/**
 * Create a test wall for testing.
 * @param overrides Optional partial Wall properties to override defaults
 * @returns Wall object for testing
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    roomIds: overrides.roomIds || [],
    length: overrides.length || 100,
    angle: overrides.angle !== undefined ? overrides.angle : 0,
    color: overrides.color || '#000000',
    height: overrides.height || 240,
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}

/**
 * Create a test room for testing.
 * @param overrides Optional partial Room properties to override defaults
 * @returns Room object for testing
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    area: overrides.area || 100,
    perimeter: overrides.perimeter || 40,
    center: overrides.center || { x: 50, y: 50 },
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    color: overrides.color || '#FFFFFF',
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}

/**
 * Create a test stroke for testing.
 * @param overrides Optional partial Stroke properties to override defaults
 * @returns Stroke object for testing
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    type: overrides.type || 'line',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}

/**
 * Create a test floor plan metadata for testing.
 * @param overrides Optional partial FloorPlanMetadata properties to override defaults
 * @returns FloorPlanMetadata object for testing
 */
export function createTestMetadata(overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    version: overrides.version || '1.0',
    paperSize: overrides.paperSize || 'A4',
    level: overrides.level !== undefined ? overrides.level : 0,
    author: overrides.author || 'Test User',
    dateCreated: overrides.dateCreated || now,
    lastModified: overrides.lastModified || now,
    notes: overrides.notes || ''
  };
}

/**
 * Create a test floor plan for testing.
 * @param overrides Optional partial FloorPlan properties to override defaults
 * @returns FloorPlan object for testing
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  const metadata = createTestMetadata(overrides.metadata || {});
  
  return {
    id: overrides.id || `floor-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || overrides.name || 'Test Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia !== undefined ? overrides.gia : 0,
    level: overrides.level !== undefined ? overrides.level : 0,
    index: overrides.index !== undefined ? overrides.index : 0,
    metadata: metadata,
    data: overrides.data || {},
    userId: overrides.userId || 'test-user-id'
  };
}

/**
 * Create mock function parameters for testing.
 * @returns An object with mock function parameters
 */
export function createMockFunctionParams() {
  return {
    mockCallback: jest.fn(),
    mockEvent: { preventDefault: jest.fn() }
  };
}
