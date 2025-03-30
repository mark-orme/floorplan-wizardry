
/**
 * Floor definitions for floor plans
 * @module types/core/floor-plan/Floor
 */

/**
 * Floor interface representing a level
 */
export interface Floor {
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Floor name */
  name: string;
}
