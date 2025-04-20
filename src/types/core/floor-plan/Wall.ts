
/**
 * Wall definitions for floor plans
 * @module types/core/floor-plan/Wall
 */

import { Point } from '../Point';
import { v4 as uuidv4 } from 'uuid';

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point coordinates */
  start: Point;
  
  /** End point coordinates */
  end: Point;
  
  /** Wall thickness in pixels */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Wall height in pixels (optional) */
  height?: number;
  
  /** Associated room IDs (required for compatibility) */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
  
  /** Points array for compatibility */
  points?: Point[];
}

/**
 * Create a wall with the specified properties
 * @param options Wall properties
 * @returns A new Wall object
 */
export function createWall(options: {
  id?: string;
  start: Point;
  end: Point;
  thickness?: number;
  color?: string;
  height?: number;
  roomIds?: string[];
}): Wall {
  const dx = options.end.x - options.start.x;
  const dy = options.end.y - options.start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  return {
    id: options.id || uuidv4(),
    start: options.start,
    end: options.end,
    thickness: options.thickness || 2,
    color: options.color || '#000000',
    height: options.height,
    roomIds: options.roomIds || [],
    length
  };
}
