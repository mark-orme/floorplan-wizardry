
/**
 * Floor plan adapter
 * Provides utilities for adapting between different floor plan formats
 * @module utils/floorPlanAdapter
 */
import { Point } from '@/types/core/Point';

// Re-export from floorPlanAdapter modules
export * from './floorPlanAdapter/index';
export * from './floorPlanAdapter/converters';
export * from './floorPlanAdapter/floorPlanTypeAdapter';

// Re-export drawing mode normalization
export const normalizeDrawingMode = (mode: string): string => {
  // Simple implementation to normalize drawing mode
  return mode.toLowerCase();
};

// Add validation functions
export const validatePoint = (point: unknown): boolean => {
  if (!point) return false;
  
  const potentialPoint = point as { x?: number; y?: number };
  return typeof potentialPoint.x === 'number' && 
    typeof potentialPoint.y === 'number';
};

export const validateColor = (color: unknown): boolean => {
  if (typeof color !== 'string') return false;
  
  return color.startsWith('#') || 
    color.startsWith('rgb') || 
    color.startsWith('hsl');
};

export const validateTimestamp = (timestamp: unknown): boolean => {
  if (typeof timestamp !== 'string') return false;
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
};

// Define StrokeType for type safety
export type StrokeType = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

export const validateStrokeType = (type: unknown): boolean => {
  const validTypes: StrokeType[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return typeof type === 'string' && validTypes.includes(type as StrokeType);
};

// Define RoomType for type safety
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

export const mapRoomType = (type: string): RoomType => {
  const validTypes: RoomType[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office'];
  return validTypes.includes(type as RoomType) ? type as RoomType : 'other';
};
