
/**
 * Test utilities for working with canvas and other components
 * @module utils/testing/testUtils
 */
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import type { ICanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Type-safe wrapper for mock canvas objects
 * Ensures proper typing in tests
 * @param mockCanvas Canvas mock object
 * @returns Properly typed canvas mock
 */
export function asMockCanvas(mockCanvas: any): FabricCanvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
  withImplementation: (callback?: Function) => Promise<void>;
} {
  // Make sure withImplementation returns a Promise<void>
  if (mockCanvas.withImplementation && typeof mockCanvas.withImplementation !== 'function') {
    mockCanvas.withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
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
    });
  }
  
  return mockCanvas as unknown as FabricCanvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
    withImplementation: (callback?: Function) => Promise<void>;
  };
}

/**
 * Creates a preconfigured mock for useFloorPlanDrawing hook
 * @returns Mocked floor plan drawing hook
 */
export function createMockFloorPlanDrawingHook() {
  return {
    isDrawing: false,
    setIsDrawing: vi.fn(),
    tool: 'select',
    setTool: vi.fn(),
    addStroke: vi.fn(),
    addRoom: vi.fn(),
    addWall: vi.fn(),
    drawFloorPlan: vi.fn()
  };
}

/**
 * Create a complete debug info state for tests
 * @returns Complete debug info state
 */
export function createCompleteDebugInfoState() {
  return {
    hasError: false,
    errorMessage: '',
    lastInitTime: Date.now(),
    lastGridCreationTime: 0,
    currentFps: 60,
    objectCount: 0,
    canvasDimensions: {
      width: 800,
      height: 600
    },
    flags: {
      gridEnabled: true,
      snapToGridEnabled: false,
      debugLoggingEnabled: false
    }
  };
}
