import { Wall } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';

/**
 * Create a mock wall object for testing
 */
export function createMockWall(partial: Partial<Wall> = {}): Wall {
  return {
    id: partial.id || 'wall-test-1',
    start: partial.start || { x: 0, y: 0 },
    end: partial.end || { x: 100, y: 0 },
    thickness: partial.thickness || 5,
    length: partial.length || 100,
    angle: partial.angle || 0,
    color: partial.color || '#000000',
    height: partial.height || 240,
    roomIds: partial.roomIds || [],
    floorPlanId: partial.floorPlanId || 'test-floor-plan',
    metadata: partial.metadata || {}
  };
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
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: 'Test floor plan'
    },
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

/**
 * Create a mock function with proper typing
 */
export function createMock<TReturn = any, TArgs extends any[] = any[]>(): jest.Mock<TReturn, TArgs> {
  return jest.fn() as jest.Mock<TReturn, TArgs>;
}

// Add missing test utilities
export function createMockFunctionParams() {
  return jest.fn();
}

export function createTestPoint(x = 0, y = 0) {
  return { x, y };
}
