
/**
 * Mock utilities for testing
 * Provides helper functions for creating mock objects and parameters
 */
import { vi } from 'vitest';
import { Point } from '@/types/floor-plan/typesBarrel';
import { ICanvasMock, createMinimalCanvasMock } from '@/types/testing/ICanvasMock';
import { FloorPlan, Wall, Room, Stroke, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/typesBarrel';
import { asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';

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
  return createMinimalCanvasMock();
}

/**
 * Safely cast a canvas mock to ICanvasMock type
 * @param mock Canvas mock to cast
 * @returns Typed canvas mock
 */
export function asCanvasMock(mock: any): ICanvasMock {
  return mock as ICanvasMock;
}

/**
 * Create a strongly typed mock function
 * @returns Mock function with proper typing
 */
export function createMockFunction<TArgs extends any[], TReturn>(): jest.Mock<TReturn, TArgs> {
  return vi.fn<TArgs, TReturn>();
}

// Alias to maintain backward compatibility
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
 */
export function createMockStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: asStrokeType(overrides.type as string || 'line'),
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

/**
 * Creates a properly typed test room
 */
export function createMockRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
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
 * Creates a properly typed test wall
 */
export function createMockWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const points = overrides.points || [start, end];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start,
    end,
    points,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],  // Make sure to include roomIds
    length: overrides.length || length,
    ...overrides
  };
}

/**
 * Creates a properly typed test floor plan
 */
export function createMockFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    data: overrides.data || {},  // Required property
    userId: overrides.userId || 'test-user', // Required property
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasJson: overrides.canvasJson || null,
    canvasData: overrides.canvasData || null,
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
    ...overrides
  };
}
