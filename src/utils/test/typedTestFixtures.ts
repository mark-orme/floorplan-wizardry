
import { Point } from '@/types/core/Point';
import { Room, Stroke } from '@/types/floor-plan/unifiedTypes';
import { asStrokeType, asRoomType } from '@/utils/typeAdapters';

/**
 * Create a test point for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A point object
 */
export const createTestPoint = (x: number = 0, y: number = 0): Point => {
  return { x, y };
};

/**
 * Create mock function parameters for testing
 * @param overrides Properties to override defaults
 * @returns Mock function parameters
 */
export const createMockFunctionParams = (overrides: Record<string, any> = {}): Record<string, any> => {
  return {
    mouseX: overrides.mouseX || 0,
    mouseY: overrides.mouseY || 0,
    pressure: overrides.pressure || 1,
    timestamp: overrides.timestamp || Date.now(),
    ...overrides
  };
};
