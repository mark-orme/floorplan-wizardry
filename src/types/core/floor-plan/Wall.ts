
/**
 * Wall definitions for floor plans
 * @module types/core/floor-plan/Wall
 */

import { Point } from '../Point';

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
  
  /** Associated room IDs (optional) */
  roomIds?: string[];
}
