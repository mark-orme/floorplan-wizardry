
/**
 * Testing utilities
 * Provides utilities for testing with fabric.js and floor plan types
 * @module utils/testing/testUtils
 */
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';
import type { 
  FloorPlan, 
  Room, 
  Stroke, 
  Wall,
  Point
} from '@/types/floor-plan/unifiedTypes';
import { 
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  createTestPoint
} from '@/types/floor-plan/unifiedTypes';

// Re-export test creation functions
export {
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  createTestPoint
};

/**
 * Convert any canvas-like object to a typed Canvas for tests
 * @param canvas Canvas-like object to convert
 * @returns Properly typed Canvas object
 */
export function asMockCanvas(canvas: any): FabricCanvas & {
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
  withImplementation: (callback?: Function) => Promise<void>;
} {
  return canvas as unknown as FabricCanvas & {
    getHandlers?: (eventName: string) => Function[];
    triggerEvent?: (eventName: string, eventData: any) => void;
    withImplementation: (callback?: Function) => Promise<void>;
  };
}

/**
 * Create a fully compatible mock canvas for testing
 * @returns Type-compatible mock canvas
 */
export function createMockCanvas() {
  return asMockCanvas({
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    withImplementation: vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in withImplementation mock:', error);
        }
      }
      return Promise.resolve();
    }),
    // Additional Canvas properties for compatibility
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: (eventName: string) => [() => {}],
    triggerEvent: (eventName: string, eventData: any) => {}
  });
}
