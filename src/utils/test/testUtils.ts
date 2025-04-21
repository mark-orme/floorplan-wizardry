
/**
 * Test utilities
 * Utilities for simplifying test setup and mocking
 * @module utils/test/testUtils
 */
import { vi } from 'vitest';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan, Stroke, Room, Wall } from '@/types/floor-plan/unifiedTypes';
import { adaptFloorPlan, adaptRoom, adaptWall } from '@/utils/typeAdapters';

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
  return mockCanvas as unknown;
}
