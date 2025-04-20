
/**
 * Mock floor plan factory
 * Utilities for creating valid floor plan test fixtures
 * @module utils/testing/mockFloorPlanFactory
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room, 
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize
} from '@/types/floor-plan/typesBarrel';

/**
 * Create a mock point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createMockPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a mock stroke
 * @param points Array of points
 * @param type Stroke type
 * @param color Stroke color
 * @param thickness Stroke thickness
 * @returns Stroke object
 */
export function createMockStroke({
  points = [createMockPoint(0, 0), createMockPoint(100, 100)],
  type = 'line' as StrokeTypeLiteral,
  color = '#000000',
  thickness = 2
}: Partial<Stroke> = {}): Stroke {
  return {
    id: uuidv4(),
    points,
    type,
    color,
    thickness,
    width: thickness
  };
}

/**
 * Create a mock wall
 * @param start Start point
 * @param end End point
 * @param thickness Wall thickness
 * @param color Wall color
 * @returns Wall object
 */
export function createMockWall({
  start = createMockPoint(0, 0),
  end = createMockPoint(100, 0),
  thickness = 10,
  color = '#888888'
}: Partial<Wall> = {}): Wall {
  const points = [start, end];
  return {
    id: uuidv4(),
    start,
    end,
    points,
    thickness,
    color,
    roomIds: [],
    length: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
  };
}

/**
 * Create a mock room
 * @param points Array of points
 * @param name Room name
 * @param type Room type
 * @param color Room color
 * @param level Room level
 * @param area Room area
 * @returns Room object
 */
export function createMockRoom({
  points = [
    createMockPoint(0, 0),
    createMockPoint(100, 0),
    createMockPoint(100, 100),
    createMockPoint(0, 100)
  ],
  name = 'Room',
  type = 'living' as RoomTypeLiteral,
  color = '#cccccc',
  level = 0,
  area = 100
}: Partial<Room> = {}): Room {
  return {
    id: uuidv4(),
    name,
    type,
    points,
    color,
    area,
    level,
    walls: []
  };
}

/**
 * Create a mock floor plan metadata
 * @param level Floor level
 * @param paperSize Paper size
 * @returns FloorPlanMetadata object
 */
export function createMockMetadata({
  level = 0,
  paperSize = PaperSize.A4
}: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize,
    level,
    version: '1.0',
    author: 'Test Author',
    notes: 'Test notes'
  };
}

/**
 * Create a mock floor plan
 * @param id Floor plan ID
 * @param name Floor plan name
 * @param label Floor plan label
 * @param level Floor level
 * @param strokes Array of strokes
 * @param walls Array of walls
 * @param rooms Array of rooms
 * @returns FloorPlan object
 */
export function createMockFloorPlan({
  id = uuidv4(),
  name = 'Test Floor Plan',
  label = 'Test Floor',
  level = 0,
  strokes = [createMockStroke()],
  walls = [createMockWall()],
  rooms = [createMockRoom()],
  gia = 0
}: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id,
    name,
    label,
    walls,
    rooms,
    strokes,
    gia,
    level,
    index: level,
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    metadata: createMockMetadata({ level }),
    data: {},
    userId: 'test-user'
  };
}
