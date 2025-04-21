
/**
 * Test utilities
 * Utilities for simplifying test setup and mocking
 * @module utils/test/testUtils
 */
import { vi } from 'vitest';
import { DrawingMode } from '@/constants/drawingModes';
import type { FloorPlan, Stroke, Room, Wall } from '@/types/floor-plan/unifiedTypes';
import { adaptFloorPlan, adaptRoom, adaptWall, adaptMetadata } from '@/utils/typeAdapters';
import { createFixedTypeMockCanvas } from './fixMockCanvas';
import { createTestFloorPlan } from './typedTestFixtures';

/**
 * Create a mock handler function that returns a promise
 * @param returnValue Value to return from the function
 * @returns Mocked function
 */
export function createMockPromiseHandler<T>(returnValue: T) {
  return vi.fn().mockResolvedValue(returnValue);
}

/**
 * Create a mocked version of the useFloorPlanDrawing hook return value
 * @returns Mocked hook return value
 */
export function createMockFloorPlanDrawingHook() {
  return {
    isDrawing: false,
    setIsDrawing: vi.fn(),
    tool: DrawingMode.SELECT,
    setTool: vi.fn(),
    addStroke: vi.fn(),
    addRoom: vi.fn(),
    addWall: vi.fn()
  };
}

/**
 * Ensure all required properties are present on test objects
 * @param floorPlan Partial floor plan
 * @returns Complete floor plan with all required properties
 */
export function completeTestFloorPlan(floorPlan: Partial<FloorPlan> & { id: string; name: string }): FloorPlan {
  return adaptFloorPlan(floorPlan);
}

/**
 * Fix the type assertion issues in tests when using Canvas mocks
 * @param mockCanvas Mock canvas instance
 * @returns Type-compatible canvas mock
 */
export function fixCanvasTyping(mockCanvas: any) {
  if (!mockCanvas.withImplementation || typeof mockCanvas.withImplementation !== 'function') {
    mockCanvas.withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in canvas mock withImplementation:', error);
        }
      }
      return Promise.resolve();
    });
  }
  
  return mockCanvas;
}

/**
 * Create a properly typed test environment for canvas tests
 * @returns Test environment with mocked canvas
 */
export function createCanvasTestEnvironment() {
  const mockCanvas = createFixedTypeMockCanvas();
  const testFloorPlan = createTestFloorPlan();
  
  return {
    canvas: mockCanvas,
    floorPlan: testFloorPlan,
    updateFloorPlan: vi.fn()
  };
}

/**
 * Create a mock DebugInfoState for tests
 * @returns Mock debug info state
 */
export function createMockDebugInfo() {
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
