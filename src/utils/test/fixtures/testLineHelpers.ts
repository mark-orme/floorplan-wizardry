
import { Point } from '@/types/core/Point';

/**
 * Create a test point for straightLineTool tests
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create mock function parameters for straightLineTool tests
 * @param overrides Properties to override defaults
 * @returns Mock function parameters object
 */
export function createMockFunctionParams(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    mouseX: overrides.mouseX || 0,
    mouseY: overrides.mouseY || 0,
    pressure: overrides.pressure || 1,
    timestamp: overrides.timestamp || Date.now(),
    ...overrides
  };
}
