
/**
 * Line state utilities for straight line tool
 * @module hooks/straightLineTool/lineState
 */
import { Point } from 'fabric';

export interface LineState {
  id: string;
  start: Point | null;
  end: Point | null;
  length: number;
  angle: number;
  active: boolean;
  color: string;
  thickness: number;
}

/**
 * Create a new line state object
 * @param overrides Properties to override in the default state
 * @returns A new line state object
 */
export const createLineState = (overrides: Partial<LineState> = {}): LineState => {
  return {
    id: overrides.id || `line-${Date.now()}`,
    start: overrides.start || null,
    end: overrides.end || null,
    length: overrides.length || 0,
    angle: overrides.angle || 0,
    active: overrides.active !== undefined ? overrides.active : false,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2
  };
};

/**
 * Update a line state with new properties
 * @param state Current line state
 * @param updates Properties to update
 * @returns Updated line state
 */
export const updateLineState = (
  state: LineState,
  updates: Partial<LineState>
): LineState => {
  return {
    ...state,
    ...updates
  };
};

/**
 * Calculate line length between two points
 * @param start Start point
 * @param end End point
 * @returns Line length
 */
export const calculateLineLength = (start: Point, end: Point): number => {
  if (!start || !end) return 0;
  
  return Math.sqrt(
    Math.pow(end.x - start.x, 2) + 
    Math.pow(end.y - start.y, 2)
  );
};

/**
 * Calculate line angle between two points
 * @param start Start point
 * @param end End point
 * @returns Angle in degrees
 */
export const calculateLineAngle = (start: Point, end: Point): number => {
  if (!start || !end) return 0;
  
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize angle to 0-360 degrees
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

export default {
  createLineState,
  updateLineState,
  calculateLineLength,
  calculateLineAngle
};
