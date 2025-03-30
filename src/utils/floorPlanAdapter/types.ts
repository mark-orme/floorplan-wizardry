
/**
 * Floor Plan Adapter Type Helpers
 * Type definitions and utilities for floor plan adapters
 * @module utils/floorPlanAdapter/types
 */
import { StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/basicTypes';

/**
 * Validate and convert a string to a valid StrokeTypeLiteral
 * @param type The string type to validate
 * @returns A valid StrokeTypeLiteral
 */
export function validateStrokeType(type: string): StrokeTypeLiteral {
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
 * Map string to a valid RoomTypeLiteral
 * @param type The string type to validate
 * @returns A valid RoomTypeLiteral
 */
export function mapRoomType(type: string): RoomTypeLiteral {
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
 * Map RoomTypeLiteral to core RoomType
 * @param type The RoomTypeLiteral to convert
 * @returns A valid RoomType
 */
export function validateRoomType(type: RoomTypeLiteral): string {
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
