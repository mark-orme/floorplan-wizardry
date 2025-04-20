
/**
 * Floor plan adapter converters
 * Provides utilities for converting between different floor plan formats
 * @module utils/floorPlanAdapter/converters
 */
import { DrawingMode } from '@/constants/drawingModes';
import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata
} from '@/types/floor-plan/unifiedTypes';

/**
 * Normalize drawing mode to a standard format
 * @param mode Drawing mode or string to normalize
 * @returns Normalized drawing mode
 */
export function normalizeDrawingMode(mode: DrawingMode | string): DrawingMode {
  if (mode in DrawingMode) {
    return mode as DrawingMode;
  }
  
  // Map legacy mode names to new mode names
  const modeMap: Record<string, DrawingMode> = {
    'select': DrawingMode.SELECT,
    'draw': DrawingMode.DRAW,
    'line': DrawingMode.LINE,
    'wall': DrawingMode.WALL,
    'room': DrawingMode.ROOM,
    'pan': DrawingMode.PAN,
    'hand': DrawingMode.HAND,
    'eraser': DrawingMode.ERASER
  };
  
  return modeMap[mode.toLowerCase()] || DrawingMode.SELECT;
}

/**
 * Valid stroke types
 */
export const VALID_STROKE_TYPES: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];

/**
 * Ensure a stroke type is valid or return a default
 * @param type Type to validate
 * @returns Valid stroke type
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  if (VALID_STROKE_TYPES.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  return 'line';
}

/**
 * Valid room types
 */
export const VALID_ROOM_TYPES: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];

/**
 * Ensure a room type is valid or return a default
 * @param type Type to validate
 * @returns Valid room type
 */
export function asRoomType(type: string): RoomTypeLiteral {
  if (VALID_ROOM_TYPES.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  return 'other';
}

/**
 * Adapt a floor plan from one format to another
 * @param floorPlan Floor plan to adapt
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(floorPlan: FloorPlan): FloorPlan {
  return {
    ...floorPlan,
    strokes: floorPlan.strokes.map(stroke => ({
      ...stroke,
      type: asStrokeType(stroke.type)
    })),
    rooms: floorPlan.rooms.map(room => ({
      ...room,
      type: asRoomType(room.type)
    }))
  };
}

/**
 * Convert application floor plans to core format
 * @param floorPlans Application floor plans
 * @returns Core floor plans
 */
export function appToCoreFloorPlans(floorPlans: FloorPlan[]): FloorPlan[] {
  return floorPlans.map(appToCoreFloorPlan);
}

/**
 * Convert a single application floor plan to core format
 * @param floorPlan Application floor plan
 * @returns Core floor plan
 */
export function appToCoreFloorPlan(floorPlan: FloorPlan): FloorPlan {
  return adaptFloorPlan(floorPlan);
}

/**
 * Convert core floor plans to application format
 * @param floorPlans Core floor plans
 * @returns Application floor plans
 */
export function coreToAppFloorPlans(floorPlans: FloorPlan[]): FloorPlan[] {
  return floorPlans.map(coreToAppFloorPlan);
}

/**
 * Convert a single core floor plan to application format
 * @param floorPlan Core floor plan
 * @returns Application floor plan
 */
export function coreToAppFloorPlan(floorPlan: FloorPlan): FloorPlan {
  return adaptFloorPlan(floorPlan);
}
