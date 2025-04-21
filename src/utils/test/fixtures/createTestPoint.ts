
import { Point } from '@/types/core/Point';

/**
 * Create a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}
