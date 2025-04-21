
/**
 * Validation utilities for floor plan data
 * @module utils/floorPlanAdapter/validators
 */

/**
 * Validate a point object
 * @param point The point to validate
 * @returns Whether the point is valid
 */
export const validatePoint = (point: any): boolean => {
  return point && 
    typeof point.x === 'number' && 
    typeof point.y === 'number';
};

/**
 * Validate a color string
 * @param color The color to validate
 * @returns Whether the color is valid
 */
export const validateColor = (color: any): boolean => {
  return typeof color === 'string' && 
    (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'));
};

/**
 * Validate a timestamp string
 * @param timestamp The timestamp to validate
 * @returns Whether the timestamp is valid
 */
export const validateTimestamp = (timestamp: any): boolean => {
  if (typeof timestamp !== 'string') return false;
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
};

/**
 * Validate a stroke type
 * @param type The type to validate
 * @returns Whether the type is valid
 */
export const validateStrokeType = (type: any): boolean => {
  const validTypes = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return typeof type === 'string' && validTypes.includes(type);
};

/**
 * Validate a room type
 * @param type The type to validate
 * @returns Whether the type is valid
 */
export const validateRoomType = (type: any): boolean => {
  const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return typeof type === 'string' && validTypes.includes(type);
};
