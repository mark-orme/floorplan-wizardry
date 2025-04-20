
/**
 * Wall Types
 * Wall interface and related types for floor plans
 * @module types/floor-plan/wallTypes
 */
import { Point } from '../core/Point';

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Points array (start and end) */
  points: Point[];
  
  /** Start point (alias for points[0]) */
  startPoint?: Point;
  
  /** End point (alias for points[1]) */
  endPoint?: Point;
  
  /** Start point (required) */
  start: Point;
  
  /** End point (required) */
  end: Point;
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs connected to this wall */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
}
