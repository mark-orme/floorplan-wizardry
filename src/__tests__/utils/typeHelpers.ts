
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { 
  FloorPlan, Stroke, Point, Wall, Room,
  StrokeTypeLiteral, RoomTypeLiteral
} from '@/types/floor-plan/typesBarrel';
import { ICanvasMock } from '@/types/testing/ICanvasMock';
import { 
  isValidFloorPlan, isValidRoom, isValidStroke, isValidWall,
  validateFloorPlanWithReporting 
} from '@/utils/debug/typeDiagnostics';
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
  // First ensure we have critical required properties
  if (!floorPlan.data) floorPlan.data = {};
  if (!floorPlan.userId) floorPlan.userId = 'test-user';
  
  // Then use the more thorough validator
  if (!validateFloorPlanWithReporting(floorPlan, 'ensureFloorPlanType')) {
    console.log('Creating new floor plan with defaults');
    return createTestFloorPlan(floorPlan);
  }
  
  console.log('Floor plan validated successfully');
  return floorPlan as FloorPlan;
}

/**
 * Create a minimal canvas reference object for tests
 * 
 * @param canvas Canvas mock
 * @returns Canvas reference object
 */
export function createCanvasRef(canvas: ICanvasMock): React.MutableRefObject<ICanvasMock> {
  console.log('Creating canvas ref with mock');
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
    const originalType = overrides.type;
    overrides.type = asStrokeType(overrides.type);
    console.log(`Converting stroke type "${originalType}" to "${overrides.type}"`);
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
    const originalType = overrides.type;
    overrides.type = asRoomType(overrides.type);
    console.log(`Converting room type "${originalType}" to "${overrides.type}"`);
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
  // Ensure roomIds is present
  if (!overrides.roomIds) {
    console.log('Adding missing roomIds to wall');
    overrides.roomIds = [];
  }
  return createTestWall(overrides);
}
