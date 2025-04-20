
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
} from "@/types/floorPlanTypes";
import {
  asStrokeType,
  asRoomType,
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
} from "@/types/floorPlanTypes";
import { ICanvasMock } from "@/types/testing/ICanvasMock";
import {
  isValidFloorPlan,
  isValidRoom,
  isValidStroke,
  isValidWall,
  validateFloorPlanWithReporting,
} from "@/utils/debug/typeDiagnostics";

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
 * Create a correct room with properly typed properties
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
 * Create a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a correct wall with properly typed properties
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

