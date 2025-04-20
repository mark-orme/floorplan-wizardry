
/**
 * Mock utilities for testing
 * Provides helper functions for creating properly typed mocks
 */
import { Canvas as FabricCanvas } from 'fabric';
import { ICanvasMock, createMinimalCanvasMock } from '@/types/testing/ICanvasMock';
import { FloorPlan, Stroke, Room, Wall, asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';

/**
 * Create a mock error logger for tests
 * @returns Mocked error logging functions
 */
export const createMockErrorLogger = () => ({
  captureError: jest.fn((error: unknown, context: string) => {
    console.error(`[Mock Error Captured] ${context}:`, error);
  }),
  captureMessage: jest.fn((message: string) => {
    console.log(`[Mock Message Captured]`, message);
  })
});

/**
 * Create a mock parameter for tests
 * Note: The returned object should only be used for parameter passing, 
 * not for spread operations as it might cause type errors.
 * 
 * @param params Parameters to include in the mock
 * @returns Typed mock object
 */
export const createMockParams = <T extends object>(params: T): T => {
  return params;
};

/**
 * Type guard for checking if an error is an Error instance
 * @param error Unknown error object
 * @returns Typed error
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Mocks a logger for testing
 */
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

/**
 * Type-safe mock for canvas event handlers
 * @param handlers Event handlers to mock
 */
export const createMockEventHandlers = <T extends Record<string, Function>>(handlers: T): T => {
  return handlers;
};

/**
 * Type-safe way to create a mock canvas with proper typing
 */
export const createSafeMockCanvas = (): ICanvasMock => {
  return createMinimalCanvasMock();
};

/**
 * Create a mock stroke with valid type
 */
export const createMockStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: asStrokeType(overrides.type as string || 'line'),
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
};

/**
 * Create a mock room with valid type
 */
export const createMockRoom = (overrides: Partial<Room> = {}): Room => {
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
};

/**
 * Create a mock wall
 */
export const createMockWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const points = overrides.points || [start, end];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: `wall-${Date.now()}`,
    start,
    end,
    points,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
};

/**
 * Create a test floor plan with all required properties
 */
export const createMockFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
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
};
