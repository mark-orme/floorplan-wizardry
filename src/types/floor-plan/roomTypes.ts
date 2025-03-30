
/**
 * Room Types
 * Room interface and related types for floor plans
 * @module types/floor-plan/roomTypes
 */
import { Point } from '../core/Point';
import { RoomTypeLiteral } from './basicTypes';

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area in square meters (required) */
  area: number;
  
  /** Room boundary points */
  points: Point[];
  
  /** Room color (required) */
  color: string;
  
  /** Floor level this room belongs to */
  level: number;
}
