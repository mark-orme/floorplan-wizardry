
/**
 * Floor Plan Adapter
 * Converts between different floor plan data formats
 * @module utils/floorPlanAdapter
 */

import { validateFloorPlan } from './validators';

/**
 * Base Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Wall interface
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height?: number;
  color?: string;
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  walls: string[]; // Wall IDs
  name?: string;
  color?: string;
  area?: number;
}

/**
 * Floor Plan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  walls: Wall[];
  rooms: Room[];
  metadata: {
    scale?: number;
    unit?: 'meters' | 'feet' | 'pixels';
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Convert a raw wall object to a proper Wall type
 * @param wall Raw wall data
 * @returns Wall object with all required properties
 */
export function adaptWall(wall: Partial<Wall>): Wall {
  return {
    id: wall.id || `wall-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    start: wall.start || { x: 0, y: 0 },
    end: wall.end || { x: 100, y: 0 },
    thickness: wall.thickness || 10,
    height: wall.height,
    color: wall.color
  };
}

/**
 * Convert a raw room object to a proper Room type
 * @param room Raw room data
 * @returns Room object with all required properties
 */
export function adaptRoom(room: Partial<Room>): Room {
  return {
    id: room.id || `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    walls: room.walls || [],
    name: room.name,
    color: room.color,
    area: room.area
  };
}

/**
 * Convert a raw floor plan object to a proper FloorPlan type
 * @param floorPlan Raw floor plan data
 * @returns FloorPlan object with all required properties
 */
export function adaptFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  const plan: FloorPlan = {
    id: floorPlan.id || `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    walls: (floorPlan.walls || []).map(adaptWall),
    rooms: (floorPlan.rooms || []).map(adaptRoom),
    metadata: {
      scale: floorPlan.metadata?.scale || 1,
      unit: floorPlan.metadata?.unit || 'meters',
      createdAt: floorPlan.metadata?.createdAt || now,
      updatedAt: floorPlan.metadata?.updatedAt || now
    }
  };
  
  // Validate the adapted floor plan
  validateFloorPlan(plan);
  
  return plan;
}

/**
 * Convert a FloorPlan to a simple JSON representation
 * @param floorPlan FloorPlan object
 * @returns JSON string of the floor plan
 */
export function floorPlanToJson(floorPlan: FloorPlan): string {
  return JSON.stringify(floorPlan);
}

/**
 * Parse a JSON string into a FloorPlan object
 * @param json JSON string of floor plan
 * @returns FloorPlan object
 */
export function jsonToFloorPlan(json: string): FloorPlan {
  try {
    const parsed = JSON.parse(json);
    return adaptFloorPlan(parsed);
  } catch (error) {
    console.error('Error parsing floor plan JSON:', error);
    throw new Error('Invalid floor plan JSON format');
  }
}
