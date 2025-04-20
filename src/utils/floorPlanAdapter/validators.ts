
/**
 * Validators for floor plan data
 * Provides utility functions for validating floor plan properties
 * @module utils/floorPlanAdapter/validators
 */

import { StrokeTypeLiteral, RoomTypeLiteral, asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';

/**
 * Validates a point with x and y coordinates
 * @param point Point to validate
 * @returns Valid point with x and y properties
 */
export function validatePoint(point: any): { x: number, y: number } {
  return {
    x: typeof point?.x === 'number' ? point.x : 0,
    y: typeof point?.y === 'number' ? point.y : 0
  };
}

/**
 * Validates a color string
 * @param color Color to validate
 * @returns Valid color string
 */
export function validateColor(color: any): string {
  return typeof color === 'string' ? color : '#000000';
}

/**
 * Validates a timestamp string
 * @param timestamp Timestamp to validate
 * @returns Valid timestamp
 */
export function validateTimestamp(timestamp: any): string {
  return typeof timestamp === 'string' ? timestamp : new Date().toISOString();
}

/**
 * Validates a stroke type to ensure it's a valid StrokeTypeLiteral
 * @param type Type to validate
 * @returns Valid StrokeTypeLiteral
 */
export function validateStrokeType(type: string): StrokeTypeLiteral {
  return asStrokeType(type);
}

/**
 * Validates a room type to ensure it's a valid RoomTypeLiteral
 * @param type Type to validate
 * @returns Valid RoomTypeLiteral
 */
export function validateRoomType(type: string): RoomTypeLiteral {
  return asRoomType(type);
}

/**
 * Maps a room type string to a valid RoomTypeLiteral 
 * (Alias for validateRoomType for backward compatibility)
 * @param type Room type to map
 * @returns Properly typed RoomTypeLiteral
 */
export const mapRoomType = validateRoomType;
