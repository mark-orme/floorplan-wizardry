
/**
 * Typed test fixtures
 * @module utils/test/typedTestFixtures
 */
import { Point } from 'fabric';
import { FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Test point
 */
export const createTestPoint = (x: number = 0, y: number = 0): Point => ({
  x,
  y
});

/**
 * Create mock function parameters
 * @param params Parameters to include
 * @returns Mock function parameters
 */
export const createMockFunctionParams = (params: Record<string, any> = {}) => params;

/**
 * Create a test wall
 * @param wall Wall properties
 * @returns Test wall
 */
export const createTestWall = (wall: Partial<Wall> = {}): Wall => ({
  id: wall.id || `wall-test-${Date.now()}`,
  start: wall.start || createTestPoint(0, 0),
  end: wall.end || createTestPoint(100, 0),
  thickness: wall.thickness || 5,
  color: wall.color || '#000000',
  roomIds: wall.roomIds || [],
  length: wall.length || 100
});

/**
 * Create a test room
 * @param room Room properties
 * @returns Test room
 */
export const createTestRoom = (room: Partial<Room> = {}): Room => ({
  id: room.id || `room-test-${Date.now()}`,
  name: room.name || 'Test Room',
  type: room.type || 'other',
  vertices: room.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ],
  points: room.points || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ],
  area: room.area || 10000,
  color: room.color || '#f0f0f0',
  level: room.level || 0,
  walls: room.walls || []
});

/**
 * Create a test stroke
 * @param stroke Stroke properties
 * @returns Test stroke
 */
export const createTestStroke = (stroke: Partial<Stroke> = {}): Stroke => ({
  id: stroke.id || `stroke-test-${Date.now()}`,
  points: stroke.points || [
    createTestPoint(0, 0),
    createTestPoint(100, 100)
  ],
  color: stroke.color || '#000000',
  width: stroke.width || 1,
  type: stroke.type || 'annotation',
  metadata: stroke.metadata || {}
});

/**
 * Create a test floor plan
 * @param floorPlan Floor plan properties
 * @returns Test floor plan
 */
export const createTestFloorPlan = (floorPlan: Partial<FloorPlan> = {}): FloorPlan => ({
  id: floorPlan.id || `floor-plan-test-${Date.now()}`,
  name: floorPlan.name || 'Test Floor Plan',
  label: floorPlan.label || 'Test Floor Plan',
  walls: floorPlan.walls || [createTestWall()],
  rooms: floorPlan.rooms || [createTestRoom()],
  strokes: floorPlan.strokes || [createTestStroke()],
  metadata: floorPlan.metadata || {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'test',
    version: '1.0.0'
  }
});
