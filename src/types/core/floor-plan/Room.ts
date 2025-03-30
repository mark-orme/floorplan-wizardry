
/**
 * Room definitions for floor plans
 * @module types/core/floor-plan/Room
 */

import { Point } from '../Point';

/**
 * Room type enum
 */
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomType;
  
  /** Room area in square meters */
  area: number;
  
  /** Boundary points */
  points: Point[];
  
  /** Fill color */
  color: string;
}
