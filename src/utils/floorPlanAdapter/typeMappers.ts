
/**
 * Type mapping utilities for floor plan data
 * @module utils/floorPlanAdapter/typeMappers
 */

/**
 * Map a room type to a standardized value
 * @param type The room type to map
 * @returns Standardized room type
 */
export const mapRoomType = (type: string): string => {
  const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office'];
  return validTypes.includes(type) ? type : 'other';
};

/**
 * Map a stroke type to a standardized value
 * @param type The stroke type to map
 * @returns Standardized stroke type
 */
export const mapStrokeType = (type: string): string => {
  const validTypes = ['line', 'wall', 'door', 'window', 'furniture'];
  return validTypes.includes(type) ? type : 'annotation';
};
