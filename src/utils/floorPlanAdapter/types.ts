
/**
 * Floor Plan Adapter Type Helpers
 * Type definitions and utilities for floor plan adapters
 * @module utils/floorPlanAdapter/types
 */
import { StrokeTypeLiteral } from '@/types/floor-plan/basicTypes';
import { StrokeType } from '@/types/core/floor-plan/Stroke';
import { RoomType } from '@/types/core/floor-plan/Room';

/**
 * Validate and convert a string to a valid StrokeTypeLiteral
 * @param type The string type to validate
 * @returns A valid StrokeTypeLiteral
 */
export function validateStrokeType(type: string | null | undefined): StrokeTypeLiteral {
  if (!type) return 'line';
  
  switch(type.toLowerCase()) {
    case 'line': return 'line';
    case 'polyline': return 'polyline';
    case 'wall': return 'wall';
    case 'room': return 'room';
    case 'freehand': return 'freehand';
    default: return 'line'; // Default to line if unknown type
  }
}

/**
 * Map string to a valid RoomType
 * @param type The string type to validate
 * @returns A valid RoomType
 */
export function mapRoomType(type: string | null | undefined): string {
  if (!type) return 'other';
  
  switch(type.toLowerCase()) {
    case 'living': return 'living';
    case 'bedroom': return 'bedroom';
    case 'kitchen': return 'kitchen';
    case 'bathroom': return 'bathroom';
    case 'office': return 'office';
    case 'other': return 'other';
    default: return 'other'; // Default to 'other' if unknown type
  }
}

/**
 * Map room type to core RoomType
 * @param type The room type to convert
 * @returns A valid RoomType
 */
export function validateRoomType(type: string | null | undefined): RoomType {
  if (!type) return 'other';
  
  switch(type.toLowerCase()) {
    case 'living': return 'living';
    case 'bedroom': return 'bedroom';
    case 'kitchen': return 'kitchen';
    case 'bathroom': return 'bathroom';
    case 'office': return 'office';
    case 'other': return 'other';
    default: return 'other'; // Default to 'other' if unknown type
  }
}
