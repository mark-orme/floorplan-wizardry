import { Point } from '@/types/floor-plan/unifiedTypes';

/**
 * Helper functions for testing line drawing functionality
 */

/**
 * Create a mock line state for testing
 */
export function createMockLineState(options: { 
  isDrawing?: boolean;
  points?: Point[];
} = {}) {
  return {
    isDrawing: options.isDrawing || false,
    startPoint: options.points?.[0] || null,
    endPoint: options.points?.[1] || null,
    // Add any other required properties for LineState
  };
}

/**
 * Create a mock line drawing in progress state
 */
export function createDrawingInProgressState(startPoint: Point, currentPoint: Point) {
  return {
    isDrawing: true,
    startPoint,
    endPoint: currentPoint,
    // Add any other required properties
  };
}

/**
 * Create a completed line drawing state
 */
export function createCompletedDrawingState(startPoint: Point, endPoint: Point) {
  return {
    isDrawing: false,
    startPoint,
    endPoint,
    // Add any other required properties
  };
}

/**
 * Create a mock point
 */
export function createMockPoint(x: number, y: number): Point {
  return { x, y };
}
