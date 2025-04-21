import { jest } from '@jest/globals';
import { FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

/**
 * Create a mock function with proper typing
 */
export function createMock<TReturn = any, TArgs extends any[] = any[]>(): jest.Mock<TReturn, TArgs> {
  return jest.fn() as jest.Mock<TReturn, TArgs>;
}

/**
 * Create a mock floor plan for testing
 */
export function createMockFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: 'test-floor-plan',
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: createCompleteMetadata({
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: 'Test floor plan'
    }),
    data: {},
    userId: 'test-user',
    ...overrides
  };
}

/**
 * Create a mock room for testing
 */
export function createMockRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'test-room',
    name: 'Test Room',
    type: 'living',
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    area: 10000,
    perimeter: 400,
    center: { x: 50, y: 50 },
    labelPosition: { x: 50, y: 50 },
    color: '#f5f5f5',
    ...overrides
  };
}

/**
 * Create a mock wall for testing
 */
export function createMockWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: 'test-wall',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 5,
    length: 100,
    color: '#000000',
    roomIds: [],
    ...overrides
  };
}

/**
 * Create a mock stroke for testing
 */
export function createMockStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: 'test-stroke',
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    type: 'line',
    color: '#000000',
    thickness: 2,
    ...overrides
  };
}

/**
 * Create a mock canvas for testing
 */
export function createMockCanvas() {
  return {
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    renderAll: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    setActiveObject: jest.fn(),
    discardActiveObject: jest.fn(),
    getActiveObject: jest.fn(),
    getContext: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    setZoom: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    on: jest.fn(),
    off: jest.fn(),
    toJSON: jest.fn().mockReturnValue({}),
    loadFromJSON: jest.fn().mockImplementation((json, callback) => {
      if (callback) callback();
      return true;
    })
  };
}

/**
 * Create a mock event for testing
 */
export function createMockEvent(overrides = {}) {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: {},
    currentTarget: {},
    ...overrides
  };
}
