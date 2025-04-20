
/**
 * Floor plan adapter converters
 * @module utils/floorPlanAdapter/converters
 */

import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { Stroke as CoreStroke } from '@/types/core/floor-plan/Stroke';
import { Wall as CoreWall } from '@/types/core/floor-plan/Wall';
import { Room as CoreRoom } from '@/types/core/floor-plan/Room';
import { 
  FloorPlan as AppFloorPlan, 
  Stroke, Wall, Room, 
  StrokeTypeLiteral, 
  RoomTypeLiteral
} from '@/types/floor-plan/typesBarrel';
import { FloorPlanMetadata } from '@/types/floor-plan/metadataTypes';
import { v4 as uuidv4 } from 'uuid';
import { asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';

// Import validators
import { validatePoint, validateColor, validateTimestamp } from './validators';

/**
 * Adapts a FloorPlan from one type to another
 * @param floorPlan Floor plan to adapt
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(floorPlan: Partial<CoreFloorPlan | any>): AppFloorPlan {
  const now = new Date().toISOString();
  
  // Create a properly formatted metadata object that matches the FloorPlanMetadata interface
  const metadata: FloorPlanMetadata = {
    createdAt: typeof floorPlan.metadata?.createdAt === 'string' ? floorPlan.metadata.createdAt : now,
    updatedAt: typeof floorPlan.metadata?.updatedAt === 'string' ? floorPlan.metadata.updatedAt : now,
    paperSize: floorPlan.metadata?.paperSize || 'A4',
    level: typeof floorPlan.metadata?.level === 'number' ? floorPlan.metadata.level : 0,
    version: floorPlan.metadata?.version || '1.0',
    author: floorPlan.metadata?.author || '',
    dateCreated: typeof floorPlan.metadata?.dateCreated === 'string' ? floorPlan.metadata.dateCreated : now,
    lastModified: typeof floorPlan.metadata?.lastModified === 'string' ? floorPlan.metadata.lastModified : now,
    notes: floorPlan.metadata?.notes || ''
  };
  
  return {
    id: floorPlan.id || uuidv4(),
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || '',
    index: typeof floorPlan.index === 'number' ? floorPlan.index : 0,
    strokes: Array.isArray(floorPlan.strokes) ? floorPlan.strokes.map((stroke: any) => ({
      id: stroke.id || uuidv4(),
      points: Array.isArray(stroke.points) ? stroke.points : [],
      type: asStrokeType(stroke.type || 'line'),
      color: stroke.color || '#000000',
      thickness: stroke.thickness || 2,
      width: stroke.width || stroke.thickness || 2
    })) : [],
    walls: Array.isArray(floorPlan.walls) ? floorPlan.walls.map((wall: any) => ({
      id: wall.id || uuidv4(),
      points: Array.isArray(wall.points) ? wall.points : [wall.start, wall.end],
      start: wall.start || (wall.points && wall.points[0]) || { x: 0, y: 0 },
      end: wall.end || (wall.points && wall.points[1]) || { x: 0, y: 0 },
      thickness: wall.thickness || 1,
      color: wall.color || '#000000',
      roomIds: Array.isArray(wall.roomIds) ? wall.roomIds : [],
      length: typeof wall.length === 'number' ? wall.length : 0
    })) : [],
    rooms: Array.isArray(floorPlan.rooms) ? floorPlan.rooms.map((room: any) => ({
      id: room.id || uuidv4(),
      name: room.name || 'Unnamed Room',
      type: asRoomType(room.type || 'other'),
      points: Array.isArray(room.points) ? room.points : Array.isArray(room.vertices) ? room.vertices : [],
      color: room.color || '#ffffff',
      area: typeof room.area === 'number' ? room.area : 0,
      level: typeof room.level === 'number' ? room.level : 0,
      walls: Array.isArray(room.walls) ? room.walls : []
    })) : [],
    level: typeof floorPlan.level === 'number' ? floorPlan.level : 0,
    gia: typeof floorPlan.gia === 'number' ? floorPlan.gia : 0,
    canvasData: floorPlan.canvasData ? (typeof floorPlan.canvasData === 'string' ? floorPlan.canvasData : JSON.stringify(floorPlan.canvasData)) : null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: typeof floorPlan.createdAt === 'string' ? floorPlan.createdAt : now,
    updatedAt: typeof floorPlan.updatedAt === 'string' ? floorPlan.updatedAt : now,
    metadata,
    // Add the missing required properties
    data: floorPlan.data || {},
    userId: floorPlan.userId || ''
  };
}

/**
 * Converts app floor plans to core floor plans
 * @param appFloorPlans App floor plans to convert
 * @returns Core floor plans
 */
export function appToCoreFloorPlans(appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appFloorPlans.map(floorPlan => {
    // Ensure all required properties are present
    return {
      id: floorPlan.id,
      name: floorPlan.name,
      label: floorPlan.label || floorPlan.name,
      index: floorPlan.index,
      level: floorPlan.level,
      walls: floorPlan.walls || [],
      rooms: floorPlan.rooms || [],
      strokes: floorPlan.strokes || [],
      gia: floorPlan.gia || 0,
      canvasData: typeof floorPlan.canvasData === 'string' && floorPlan.canvasData ? 
        JSON.parse(floorPlan.canvasData) : null,
      canvasJson: floorPlan.canvasJson,
      createdAt: floorPlan.createdAt,
      updatedAt: floorPlan.updatedAt,
      metadata: floorPlan.metadata,
      paperSize: floorPlan.metadata?.paperSize,
      // Include these for test compatibility
      data: floorPlan.data || {},
      userId: floorPlan.userId || ''
    } as unknown as CoreFloorPlan;
  });
}

/**
 * Converts core floor plans to app floor plans
 * @param coreFloorPlans Core floor plans to convert
 * @returns App floor plans
 */
export function coreToAppFloorPlans(coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] {
  return coreFloorPlans.map(floorPlan => adaptFloorPlan(floorPlan));
}

/**
 * Convert a single app floor plan to core floor plan
 * @param appFloorPlan App floor plan to convert
 * @returns Core floor plan
 */
export const appToCoreFloorPlan = (appFloorPlan: AppFloorPlan): CoreFloorPlan => 
  appToCoreFloorPlans([appFloorPlan])[0];

/**
 * Convert a single core floor plan to app floor plan
 * @param coreFloorPlan Core floor plan to convert
 * @returns App floor plan
 */
export const coreToAppFloorPlan = (coreFloorPlan: CoreFloorPlan): AppFloorPlan => 
  coreToAppFloorPlans([coreFloorPlan])[0];
