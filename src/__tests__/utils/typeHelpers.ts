
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from "fabric";
import type {
  FloorPlan,
  Stroke,
  Point,
  Wall,
  Room,
  StrokeTypeLiteral,
  RoomTypeLiteral,
} from "@/types/floor-plan/typesBarrel";
import { ICanvasMock } from "@/types/testing/ICanvasMock";
import {
  isValidFloorPlan,
  isValidRoom,
  isValidStroke,
  isValidWall,
  validateFloorPlanWithReporting,
} from "@/utils/debug/typeDiagnostics";

// Add missing type guard utility functions for use in tests
/**
 * Converts a string to a valid StrokeTypeLiteral
 * @param type String to convert
 * @returns Validated StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  // Basic validation to ensure we have a valid stroke type
  const validTypes: StrokeTypeLiteral[] = ['line', 'curve', 'straight', 'freehand', 'polyline'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
}

/**
 * Converts a string to a valid RoomTypeLiteral
 * @param type String to convert
 * @returns Validated RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  // Basic validation to ensure we have a valid room type
  const validTypes: RoomTypeLiteral[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'dining', 'office', 'hallway', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

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
 * Uses our test creator function for type safety
 * 
 * @param floorPlan Floor plan object to check
 * @returns Typed floor plan
 */
export function ensureFloorPlanType(floorPlan: Partial<FloorPlan>): FloorPlan {
  // Ensure mandatory properties
  if (!floorPlan.data) floorPlan.data = {};
  if (!floorPlan.userId) floorPlan.userId = "test-user";
  if (!validateFloorPlanWithReporting(floorPlan, "ensureFloorPlanType")) {
    console.log("Creating new floor plan with defaults");
    return createTestFloorPlan(floorPlan);
  }
  console.log("Floor plan validated successfully");
  return floorPlan as FloorPlan;
}

/**
 * Create a minimal canvas reference object for tests
 * 
 * @param canvas Canvas mock
 * @returns Canvas reference object
 */
export function createCanvasRef(
  canvas: ICanvasMock
): React.MutableRefObject<ICanvasMock> {
  console.log("Creating canvas ref with mock");
  return { current: canvas };
}

/**
 * Create a correct stroke with properly typed properties
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Stroke object
 */
export function createTestStroke(
  overrides: Partial<Stroke> = {}
): Stroke {
  const now = new Date().toISOString();
  let typeLiteral: StrokeTypeLiteral = 'line';
  
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asStrokeType(overrides.type);
  }
  
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: typeLiteral,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

/**
 * Create a correct room with properly typed properties
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Room object
 */
export function createTestRoom(
  overrides: Partial<Room> = {}
): Room {
  let typeLiteral: RoomTypeLiteral = 'other';
  
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asRoomType(overrides.type);
  }
  
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: typeLiteral,
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
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Wall object
 */
export function createTestWall(
  overrides: Partial<Wall> = {}
): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start,
    end,
    points: overrides.points || [start, end],
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
}

/**
 * Create a properly typed test floor plan with required properties
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed FloorPlan object
 */
export function createTestFloorPlan(
  overrides: Partial<FloorPlan> = {}
): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
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
    metadata: overrides.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    // Required properties that were missing
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
}

/**
 * Create a test type stroke with properly typed properties
 * Uses our test creator function for type safety
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Stroke object
 */
export function createTestTypeStroke(
  overrides: Partial<Stroke> = {}
): Stroke {
  let typeLiteral: StrokeTypeLiteral | undefined;
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asStrokeType(overrides.type);
    overrides.type = typeLiteral;
    console.log(`Converting stroke type "${overrides.type}" to "${typeLiteral}"`);
  } else if (!overrides.type) {
    overrides.type = asStrokeType("line");
  }
  return createTestStroke(overrides);
}

/**
 * Create a test type room with properly typed properties
 * Uses our test creator function for type safety
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Room object
 */
export function createTestTypeRoom(
  overrides: Partial<Room> = {}
): Room {
  let typeLiteral: RoomTypeLiteral | undefined;
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asRoomType(overrides.type);
    overrides.type = typeLiteral;
    console.log(`Converting room type "${overrides.type}" to "${typeLiteral}"`);
  } else if (!overrides.type) {
    overrides.type = asRoomType("other");
  }
  return createTestRoom(overrides);
}

/**
 * Create a test type wall with properly typed properties
 * Uses our test creator function for type safety
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Wall object
 */
export function createTestTypeWall(
  overrides: Partial<Wall> = {}
): Wall {
  if (!overrides.roomIds) {
    overrides.roomIds = [];
  }
  return createTestWall(overrides);
}
