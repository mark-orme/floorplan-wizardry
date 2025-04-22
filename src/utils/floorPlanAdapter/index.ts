
/**
 * Floor plan adapter
 * @module utils/floorPlanAdapter/index
 */

// Export converters
export * from './converters';
export * from './floorPlanTypeAdapter';

// Export validators
export const validatePoint = (point: any): boolean => {
  return point && 
    typeof point.x === 'number' && 
    typeof point.y === 'number';
};

export const validateColor = (color: any): boolean => {
  return typeof color === 'string' && 
    (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl'));
};

export const validateTimestamp = (timestamp: any): boolean => {
  if (typeof timestamp !== 'string') return false;
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
};

export const validateStrokeType = (type: any): boolean => {
  const validTypes = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return typeof type === 'string' && validTypes.includes(type);
};

export const mapRoomType = (type: string): string => {
  const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office'];
  return validTypes.includes(type) ? type : 'other';
};
