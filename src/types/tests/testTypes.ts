
import { FloorPlan } from '@/types/floor-plan/typesBarrel';
import { PaperSize } from '@/types/floorPlanTypes';

/**
 * Creates a test floor plan for testing purposes
 * @param overrides - Optional properties to override defaults
 * @returns FloorPlan object for testing
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: `test-fp-${Date.now()}`,
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    data: {},
    userId: 'test-user',
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: "A4", // Use string literal instead of enum value
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

/**
 * Mock Canvas type for testing
 */
export interface MockCanvas {
  id: string;
  on: jest.Mock;
  off: jest.Mock;
  add: jest.Mock;
  remove: jest.Mock;
  getObjects: jest.Mock;
  setBackgroundColor: jest.Mock;
  renderAll: jest.Mock;
  getPointer: jest.Mock;
  setZoom: jest.Mock;
  discardActiveObject: jest.Mock;
}

/**
 * Creates a mock Canvas object for testing
 * @returns MockCanvas object
 */
export const createMockCanvas = (): MockCanvas => ({
  id: `canvas-${Date.now()}`,
  on: jest.fn(),
  off: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  getObjects: jest.fn().mockReturnValue([]),
  setBackgroundColor: jest.fn(),
  renderAll: jest.fn(),
  getPointer: jest.fn().mockReturnValue({ x: 0, y: 0 }),
  setZoom: jest.fn(),
  discardActiveObject: jest.fn()
});

/**
 * Helper function to cast an object to a Canvas type for testing
 * @param mockCanvas - Mock canvas object
 * @returns Canvas-typed object
 */
export const asMockCanvas = (mockCanvas: any): any => mockCanvas;
