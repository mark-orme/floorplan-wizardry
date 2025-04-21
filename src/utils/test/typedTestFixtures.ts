
/**
 * Type-safe test fixtures
 * @module utils/test/typedTestFixtures
 */
import { vi } from 'vitest';
import { Point } from '@/types/core/Point';
import { 
  StrokeTypeLiteral, 
  RoomTypeLiteral,
  FloorPlanMetadata
} from '@/types/floor-plan/unifiedTypes';
import { asStrokeType, asRoomType } from '@/utils/typeAdapters';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

/**
 * Test Room interface
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  area: number;
  perimeter: number;
  labelPosition: Point;
  center: Point;
  color: string;
}

/**
 * Test Wall interface
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
  height?: number;
}

/**
 * Test Stroke interface
 */
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

/**
 * Test FloorPlan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: FloorPlanMetadata;
  data: Record<string, any>;
  canvasData: any;
  canvasJson: any;
  canvasState: any;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  userId: string;
}

/**
 * Create a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a test stroke
 * @param partialStroke Partial stroke data
 * @returns Test stroke
 */
export function createTestStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  const type = partialStroke.type || asStrokeType('line');
  
  return {
    id: partialStroke.id || 'stroke-test',
    points: partialStroke.points || [createTestPoint(0, 0), createTestPoint(100, 100)],
    type,
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || 2
  };
}

/**
 * Create a test wall
 * @param partialWall Partial wall data
 * @returns Test wall
 */
export function createTestWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || createTestPoint(0, 0);
  const end = partialWall.end || createTestPoint(100, 0);
  
  return {
    id: partialWall.id || 'wall-test',
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    ),
    height: partialWall.height
  };
}

/**
 * Create a test room
 * @param partialRoom Partial room data
 * @returns Test room
 */
export function createTestRoom(partialRoom: Partial<Room> = {}): Room {
  const type = partialRoom.type || asRoomType('other');
  
  const vertices = partialRoom.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];
  
  const center = {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };
  
  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return {
    id: partialRoom.id || 'room-test',
    name: partialRoom.name || 'Test Room',
    type,
    vertices,
    area: partialRoom.area || 10000,
    perimeter: partialRoom.perimeter || perimeter,
    labelPosition: partialRoom.labelPosition || center,
    center: partialRoom.center || center,
    color: partialRoom.color || '#f5f5f5'
  };
}

/**
 * Create a test floor plan
 * @param partialFloorPlan Partial floor plan data
 * @returns Test floor plan
 */
export function createTestFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: partialFloorPlan.id || 'floor-test',
    name: partialFloorPlan.name || 'Test Floor Plan',
    label: partialFloorPlan.label || 'Test Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    canvasState: partialFloorPlan.canvasState || null,
    metadata: partialFloorPlan.metadata || createCompleteMetadata(),
    data: partialFloorPlan.data || {},
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    userId: partialFloorPlan.userId || 'test-user'
  };
}

// Re-export the type utility functions
export { asStrokeType, asRoomType };
