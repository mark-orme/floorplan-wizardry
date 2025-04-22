
/**
 * Floor plan adapters and converters
 * @module utils/floorPlanAdapter/converters
 */
 
// Import from unifiedTypes instead of core/floor-plan/FloorPlan
import type { FloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import type { Point } from '@/types/core/Point';
import { adaptFloorPlan, asRoomType, asStrokeType, adaptStroke, adaptRoom, adaptWall, adaptMetadata } from '@/utils/typeAdapters';

/**
 * Convert core floor plans to app floor plans
 * @param corePlans Array of core floor plans
 * @returns Array of app floor plans
 */
export function coreToAppFloorPlans(corePlans: any[]): FloorPlan[] {
  return corePlans.map(plan => adaptFloorPlan(plan));
}

/**
 * Convert app floor plans to core floor plans
 * @param appPlans Array of app floor plans
 * @returns Array of core floor plans
 */
export function appToCoreFloorPlans(appPlans: FloorPlan[]): any[] {
  return appPlans;
}

/**
 * Convert wall to compatible format
 * @param wall Wall to convert
 * @returns Converted wall
 */
export function convertWall(wall: Wall): Wall {
  return adaptWall(wall);
}

/**
 * Convert room to compatible format
 * @param room Room to convert
 * @returns Converted room
 */
export function convertRoom(room: Room): Room {
  return adaptRoom(room);
}

/**
 * Convert stroke to compatible format
 * @param stroke Stroke to convert
 * @returns Converted stroke
 */
export function convertStroke(stroke: Stroke): Stroke {
  return adaptStroke(stroke);
}

/**
 * Convert metadata to compatible format
 * @param metadata Metadata to convert
 * @returns Converted metadata
 */
export function convertMetadata(metadata: any): any {
  return adaptMetadata(metadata);
}
