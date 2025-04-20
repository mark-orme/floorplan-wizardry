
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { 
  FloorPlan, Stroke, Point, Wall, Room,
  StrokeTypeLiteral, RoomTypeLiteral
} from '@/types/floorPlanTypes';
import { ICanvasMock } from '@/types/testing/ICanvasMock';
import { 
  validateFloorPlan, validateRoom, validateStroke, validateWall,
  validateFloorPlanWithTypeCheck 
} from '@/utils/sentry/typeMonitoring';
import { 
  createTestFloorPlan, createTestRoom, createTestStroke, createTestWall 
} from '@/tests/utils/testObjectCreator';
import {
  ensureFloorPlan, ensureStroke, ensureRoom, ensureWall,
  asStrokeType, asRoomType
} from '@/utils/test/typeGaurd';

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
  // Validate the floor plan to ensure it has all required properties
  if (!validateFloorPlanWithTypeCheck(floorPlan)) {
    return createTestFloorPlan(floorPlan);
  }
  
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
 * Uses our test creator function for type safety
 * 
 * @param overrides Properties to override default values
 * @returns A properly typed Stroke object
 */
export function createTestTypeStroke(overrides: Partial<Stroke> = {}): Stroke {
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asStrokeType(overrides.type);
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
export function createTestTypeRoom(overrides: Partial<Room> = {}): Room {
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asRoomType(overrides.type);
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
export function createTestTypeWall(overrides: Partial<Wall> = {}): Wall {
  return createTestWall(overrides);
}
