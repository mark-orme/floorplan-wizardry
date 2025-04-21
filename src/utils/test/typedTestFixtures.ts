
/**
 * Type-safe test fixtures for unit tests
 * @module utils/test/typedTestFixtures
 */
import { v4 as uuidv4 } from 'uuid';
import {
  FloorPlan,
  FloorPlanMetadata,
  Wall,
  Room,
  Stroke,
  Point,
  PaperSize,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from '@/types/floor-plan/unifiedTypes';

// Re-export these types for use in tests
export type { FloorPlan, Stroke, Wall, Room, Point, FloorPlanMetadata };

/**
 * Type assertion for stroke types
 * @param type The type as string
 * @returns The validated stroke type
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
}

/**
 * Type assertion for room types
 * @param type The type as string
 * @returns The validated room type
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

/**
 * Create a test point for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A point object
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a test stroke for testing
 * @param props Optional properties
 * @returns A stroke object
 */
export function createTestStroke(props: Partial<Stroke> = {}): Stroke {
  return {
    id: props.id || `stroke-${uuidv4()}`,
    points: props.points || [
      createTestPoint(0, 0),
      createTestPoint(100, 100)
    ],
    type: props.type || 'line',
    color: props.color || '#000000',
    thickness: props.thickness || 2,
    width: props.width || 2
  };
}

/**
 * Create a test wall for testing
 * @param props Optional properties
 * @returns A wall object
 */
export function createTestWall(props: Partial<Wall> = {}): Wall {
  const start = props.start || createTestPoint(0, 0);
  const end = props.end || createTestPoint(100, 0);
  const length = props.length || Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  return {
    id: props.id || `wall-${uuidv4()}`,
    start,
    end,
    length,
    thickness: props.thickness || 5,
    color: props.color || '#333333',
    roomIds: props.roomIds || [],
    height: props.height,
    points: props.points || [start, end]
  };
}

/**
 * Create a test room for testing
 * @param props Optional properties
 * @returns A room object
 */
export function createTestRoom(props: Partial<Room> = {}): Room {
  const vertices = props.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];
  
  // Calculate center point
  const center = props.center || {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };
  
  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const dx = vertices[j].x - vertices[i].x;
    const dy = vertices[j].y - vertices[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return {
    id: props.id || `room-${uuidv4()}`,
    name: props.name || 'Test Room',
    type: props.type || 'other',
    vertices,
    area: props.area || 10000,
    perimeter: props.perimeter || perimeter,
    labelPosition: props.labelPosition || center,
    center,
    color: props.color || '#f5f5f5'
  };
}

/**
 * Create a complete metadata object with required fields
 * @param overrides Optional overrides
 * @returns Floor plan metadata
 */
export function createTestMetadata(overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    paperSize: overrides.paperSize || PaperSize.A4,
    level: overrides.level ?? 0,
    version: overrides.version || '1.0',
    author: overrides.author || 'Test Author',
    dateCreated: overrides.dateCreated || now,
    lastModified: overrides.lastModified || now,
    notes: overrides.notes || ''
  };
}

/**
 * Create a test floor plan for testing
 * @param props Optional properties
 * @returns A floor plan object
 */
export function createTestFloorPlan(props: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: props.id || `floorplan-${uuidv4()}`,
    name: props.name || 'Test Floor Plan',
    label: props.label || 'Test Floor Plan',
    walls: props.walls || [],
    rooms: props.rooms || [],
    strokes: props.strokes || [],
    canvasData: props.canvasData || null,
    canvasJson: props.canvasJson || null,
    canvasState: props.canvasState || null,
    createdAt: props.createdAt || now,
    updatedAt: props.updatedAt || now,
    gia: props.gia ?? 0,
    level: props.level ?? 0,
    index: props.index ?? 0,
    metadata: props.metadata || createTestMetadata({ level: props.level }),
    data: props.data || {},
    userId: props.userId || 'test-user'
  };
}

// Also create aliases for the typed test fixtures
export const createTypedTestFloorPlan = createTestFloorPlan;
export const createTypedTestStroke = createTestStroke;
export const createTypedTestWall = createTestWall;
export const createTypedTestRoom = createTestRoom;
export const createTypedTestPoint = createTestPoint;
