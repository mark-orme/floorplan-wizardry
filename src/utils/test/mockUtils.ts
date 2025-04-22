
// Importing the types from floor-plan/unifiedTypes
import { FloorPlan, Wall, Room, Stroke } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';

/**
 * Create a mock floor plan
 * @param overrides Properties to override defaults
 * @returns A mock floor plan
 */
export function createMockFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: overrides.id || `floor-${Date.now()}`,
    name: overrides.name || 'Mock Floor Plan',
    label: overrides.label || 'Mock Floor',
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
    metadata: {
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0
    },
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
}

/**
 * Create a mock room
 * @param overrides Properties to override defaults
 * @returns A mock room
 */
export function createMockRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Mock Room',
    type: overrides.type || 'living',
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
    floorPlanId: overrides.floorPlanId || 'test-floor-plan',
    color: overrides.color || '#ffffff'
  };
}

/**
 * Create a mock wall
 * @param overrides Properties to override defaults
 * @returns A mock wall
 */
export function createMockWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    length: overrides.length || 100,
    angle: overrides.angle || 0, // Required property
    color: overrides.color || '#000000',
    height: overrides.height || 240,
    roomIds: overrides.roomIds || [],
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}

/**
 * Create a mock stroke
 * @param overrides Properties to override defaults
 * @returns A mock stroke
 */
export function createMockStroke(overrides: Partial<Stroke> = {}): Stroke {
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
 * Create a mock point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A point object
 */
export function createMockPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}
