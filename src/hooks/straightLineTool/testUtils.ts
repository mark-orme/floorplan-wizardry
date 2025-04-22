
/**
 * Test utilities for Straight Line Tool
 * Provides helper functions for testing the line tool hooks
 */
import { Point } from 'fabric';
import { LineState } from './lineState';

/**
 * Create an initial line state for testing
 * @returns Initial line state
 */
export function createInitialLineState(): LineState {
  return {
    startPoint: null,
    endPoint: null,
    isDrawing: false,
    tempLine: null,
    lastPosition: null
  };
}

/**
 * Create a line state with a start point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Line state with start point
 */
export function createLineStateWithStart(x: number = 100, y: number = 100): LineState {
  return {
    startPoint: new Point(x, y),
    endPoint: null,
    isDrawing: true,
    tempLine: null,
    lastPosition: new Point(x, y)
  };
}

/**
 * Create a line state with start and end points
 * @param startX Start X coordinate
 * @param startY Start Y coordinate
 * @param endX End X coordinate
 * @param endY End Y coordinate
 * @returns Complete line state
 */
export function createCompleteLineState(
  startX: number = 100, 
  startY: number = 100,
  endX: number = 200,
  endY: number = 200
): LineState {
  return {
    startPoint: new Point(startX, startY),
    endPoint: new Point(endX, endY),
    isDrawing: true,
    tempLine: null, // In a real scenario this would be a Line object
    lastPosition: new Point(endX, endY)
  };
}
