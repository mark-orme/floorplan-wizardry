
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Point, StrokeTypeLiteral, RoomTypeLiteral, asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';
import { ICanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Safely type a canvas mock as a minimal interface
 * Prevents TS errors with properties not used in tests
 * 
 * @param mockCanvas Canvas mock object
 * @returns Properly typed canvas mock
 */
export function asCanvasMock(mockCanvas: any): ICanvasMock {
  return mockCanvas as ICanvasMock;
}

/**
 * Ensure a floor plan object conforms to the FloorPlan interface
 * 
 * @param floorPlan Floor plan object to check
 * @returns Typed floor plan
 */
export function ensureFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  // Ensure required properties exist
  if (!floorPlan.id) {
    floorPlan.id = `test-fp-${Date.now()}`;
  }
  
  if (!floorPlan.updatedAt) {
    floorPlan.updatedAt = new Date().toISOString();
  }
  
  if (!floorPlan.createdAt) {
    floorPlan.createdAt = floorPlan.updatedAt;
  }
  
  // Ensure data and userId properties exist (add if missing)
  if (!floorPlan.data) {
    floorPlan.data = {};
  }
  
  if (!floorPlan.userId) {
    floorPlan.userId = 'test-user';
  }
  
  // Add metadata if missing
  if (!floorPlan.metadata) {
    floorPlan.metadata = {
      createdAt: floorPlan.createdAt,
      updatedAt: floorPlan.updatedAt,
      paperSize: 'A4',
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: floorPlan.createdAt,
      lastModified: floorPlan.updatedAt,
      notes: ""
    };
  }
  
  // Add empty arrays for collections if missing
  if (!floorPlan.strokes) floorPlan.strokes = [];
  if (!floorPlan.walls) floorPlan.walls = [];
  if (!floorPlan.rooms) floorPlan.rooms = [];
  
  // Set defaults for other required fields
  if (floorPlan.label === undefined) floorPlan.label = floorPlan.name || 'Test Floor Plan';
  if (floorPlan.gia === undefined) floorPlan.gia = 0;
  if (floorPlan.level === undefined) floorPlan.level = 0;
  if (floorPlan.index === undefined) floorPlan.index = 0;
  if (floorPlan.canvasData === undefined) floorPlan.canvasData = null;
  if (floorPlan.canvasJson === undefined) floorPlan.canvasJson = null;
  
  return floorPlan as FloorPlan;
}

/**
 * Create a minimal canvas reference object for tests
 * 
 * @param canvas Canvas mock
 * @returns Canvas reference object
 */
export function createCanvasRef(canvas: ICanvasMock): React.MutableRefObject<ICanvasMock> {
  return { current: canvas };
}

/**
 * Create a correct stroke with properly typed properties
 * @param overrides Properties to override default values
 * @returns A properly typed Stroke object
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: `stroke-${Date.now()}`,
    points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: asStrokeType(overrides.type as string || 'line'),
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

/**
 * Create a correct room with properly typed properties
 * @param overrides Properties to override default values
 * @returns A properly typed Room object
 */
export function createTestRoom(overrides: Partial<any> = {}): any {
  return {
    id: `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: asRoomType(overrides.type as string || 'other'),
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || [],
    ...overrides
  };
}

/**
 * Create a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a correct wall with properly typed properties
 * @param overrides Properties to override default values
 * @returns A properly typed Wall object
 */
export function createTestWall(overrides: Partial<any> = {}): any {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: `wall-${Date.now()}`,
    start,
    end,
    points: [start, end],
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
}
