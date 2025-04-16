
import { Point } from "@/types/core/Point";
import { createPoint } from "../pointHelpers";

// Validate and convert stroke types
export const validateStrokeType = (type: string): string => {
  const validTypes = ['freehand', 'line', 'wall', 'room', 'furniture', 'text', 'dimension'];
  return validTypes.includes(type) ? type : 'freehand';
};

// Map room type strings
export const mapRoomType = (type: string): string => {
  const validRoomTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validRoomTypes.includes(type) ? type : 'other';
};

// Validate timestamps
export const validateTimestamp = (timestamp: string | null | undefined): string => {
  if (!timestamp) {
    return new Date().toISOString();
  }
  
  try {
    // Check if it's a valid ISO timestamp
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return timestamp;
  } catch (e) {
    return new Date().toISOString();
  }
};

// Validate colors
export const validateColor = (color: string | null | undefined, defaultColor = '#000000'): string => {
  if (!color) return defaultColor;
  
  // Simple validation - could be enhanced for more strict validation
  return color;
};

// Validate point data
export const validatePoint = (pointData: any): Point => {
  if (!pointData || typeof pointData !== 'object') {
    return createPoint(0, 0);
  }
  
  const x = typeof pointData.x === 'number' ? pointData.x : 0;
  const y = typeof pointData.y === 'number' ? pointData.y : 0;
  
  return createPoint(x, y);
};

// Validate room type
export const validateRoomType = (type: string): string => {
  const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type) ? type : 'other';
};
