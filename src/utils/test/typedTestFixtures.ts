/**
 * Typed test fixture utilities
 * Provides strongly-typed test objects for unit testing
 */
import {
  Room,
  Wall,
  Stroke,
  FloorPlan,
  RoomTypeLiteral,
  StrokeTypeLiteral
} from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { asStrokeType, asRoomType } from '@/utils/typeAdapters';

// Generate a test floor plan with default values
export function createTestFloorPlan(
  overrides: Partial<FloorPlan> = {}
): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: overrides.id || `test-floor-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor',
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
    metadata: overrides.metadata || {
      createdAt: now,
      updatedAt: now,
      version: '1.0',
      paperSize: 'A4',
      level: 0,
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      scale: 1,
      unit: 'mm',
      gridSize: 10
    },
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
}

// Generate a test wall with default values
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || `test-wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness !== undefined ? overrides.thickness : 1,
    length: overrides.length !== undefined ? overrides.length : 100,
    angle: overrides.angle !== undefined ? overrides.angle : 0,
    roomIds: overrides.roomIds || [],
    floorPlanId: overrides.floorPlanId || 'test-floor',
  };
}

// Generate a test room with default values
export function createTestRoom(
  overrides: Partial<Room> = {}
): Room {
  return {
    id: overrides.id || `test-room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'living' as RoomTypeLiteral,
    area: overrides.area !== undefined ? overrides.area : 100,
    perimeter: overrides.perimeter !== undefined ? overrides.perimeter : 40,
    center: overrides.center || { x: 50, y: 50 },
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    floorPlanId: overrides.floorPlanId || 'test-floor'
  };
}

// Generate a test stroke with default values
export function createTestStroke(
  overrides: Partial<Stroke> = {}
): Stroke {
  return {
    id: overrides.id || `test-stroke-${Date.now()}`,
    type: overrides.type || 'line' as StrokeTypeLiteral,
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: overrides.color || '#000000',
    thickness: overrides.thickness !== undefined ? overrides.thickness : 1,
    floorPlanId: overrides.floorPlanId || 'test-floor'
  };
}

// Generate a test point with default values
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}
