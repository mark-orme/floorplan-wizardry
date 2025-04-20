
/**
 * Mock utilities for testing
 * Provides helper functions for creating mock objects and parameters
 */
import { vi } from 'vitest';
import { Point } from '@/types/floor-plan/typesBarrel';
import { ICanvasMock, createMinimalCanvasMock } from '@/types/testing/ICanvasMock';
import { 
  FloorPlan, 
  Wall, 
  Room, 
  Stroke, 
  StrokeTypeLiteral, 
  RoomTypeLiteral,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/typesBarrel';

console.log('Loading mock utilities for testing');

/**
 * Creates type-safe mock parameters
 * @param params Parameters object
 * @returns The same parameters with proper typing
 */
export function createMockParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Creates a test point with x and y coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Safely type cast mock objects
 * @param mock Object to cast
 * @returns Typed mock object
 */
export function asMock<T>(mock: any): T {
  return mock as T;
}

/**
 * Creates a canvas mock with proper typing
 * @returns Canvas mock
 */
export function createCanvasMock(): ICanvasMock {
  console.log('Creating canvas mock with ICanvasMock interface');
  return createMinimalCanvasMock();
}

/**
 * Safely cast a canvas mock to ICanvasMock type
 * @param mock Canvas mock to cast
 * @returns Typed canvas mock
 */
export function asCanvasMock(mock: any): ICanvasMock {
  console.log('Casting object to ICanvasMock type');
  return mock as ICanvasMock;
}

/**
 * Create a strongly typed mock function
 * @returns Mock function with proper typing
 */
export function createMockFunction<TArgs extends any[], TReturn>(): jest.Mock<TReturn, TArgs> {
  return vi.fn<TArgs, TReturn>();
}

// Alias to maintain backward compatibility (used in tests)
export const createMockFunctionParams = createMockParams;

/**
 * Creates a mock implementation that returns a Promise
 * @param value Value to resolve with
 * @returns Mock implementation function
 */
export function createMockAsyncImplementation<T>(value: T): () => Promise<T> {
  return vi.fn().mockResolvedValue(value);
}

/**
 * Creates a properly typed test stroke
 * CRITICAL FIX: Ensure type property is properly cast to StrokeTypeLiteral
 */
export function createMockStroke(overrides: Partial<Stroke> = {}): Stroke {
  console.log('Creating mock stroke with overrides:', { 
    id: overrides.id, 
    type: overrides.type 
  });
  
  // Ensure type is a valid StrokeTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    console.log(`Validating stroke type: ${overrides.type}`);
    overrides.type = asStrokeType(overrides.type);
  }
  
  return {
    id: overrides.id || `mock-stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || (overrides.thickness || 2)
  };
}

/**
 * Creates a properly typed test room
 */
export function createMockRoom(overrides: Partial<Room> = {}): Room {
  console.log('Creating mock room with overrides:', { 
    id: overrides.id, 
    type: overrides.type 
  });
  
  // Ensure type is a valid RoomTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    console.log(`Validating room type: ${overrides.type}`);
    overrides.type = asRoomType(overrides.type);
  }
  
  return {
    id: overrides.id || `mock-room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#cccccc',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || []
  };
}

/**
 * Creates a properly typed test wall
 */
export function createMockWall(overrides: Partial<Wall> = {}): Wall {
  console.log('Creating mock wall with overrides:', { 
    id: overrides.id,
    hasRoomIds: !!overrides.roomIds
  });
  
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  
  return {
    id: overrides.id || `mock-wall-${Date.now()}`,
    start,
    end,
    points: overrides.points || [start, end],
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [], // Ensuring roomIds is always provided
    length: overrides.length || 100
  };
}

/**
 * Creates a properly typed test floor plan
 * CRITICAL FIX: Ensure required properties data and userId are always present
 */
export function createMockFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  console.log('Creating mock floor plan with overrides:', { 
    id: overrides.id,
    hasData: !!overrides.data,
    hasUserId: !!overrides.userId
  });
  
  const now = new Date().toISOString();
  
  // Ensure data and userId are present
  if (!overrides.data) {
    console.log('Adding missing data property to floor plan');
    overrides.data = {};
  }
  
  if (!overrides.userId) {
    console.log('Adding missing userId property to floor plan');
    overrides.userId = 'test-user';
  }
  
  return {
    id: overrides.id || `mock-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || (overrides.level || 0),
    metadata: overrides.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: overrides.level || 0
    },
    data: overrides.data, // Required property
    userId: overrides.userId // Required property
  };
}
