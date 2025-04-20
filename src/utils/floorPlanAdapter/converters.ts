
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { Stroke as CoreStroke } from '@/types/FloorPlan';
import { Wall as CoreWall } from '@/types/FloorPlan';
import { Room as CoreRoom } from '@/types/FloorPlan';
import { FloorPlan as AppFloorPlan, StrokeTypeLiteral, RoomTypeLiteral, Stroke, Wall, Room } from '@/types/floor-plan/typesBarrel';
import { v4 as uuidv4 } from 'uuid';
import { asStrokeType, asRoomType } from '@/types/floor-plan/typesBarrel';

/**
 * Adapts a FloorPlan from one type to another
 * @param floorPlan Floor plan to adapt
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(floorPlan: Partial<CoreFloorPlan>): AppFloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || uuidv4(),
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || '',
    index: floorPlan.index || 0,
    strokes: floorPlan.strokes?.map(stroke => ({
      id: stroke.id,
      points: stroke.points || [],
      type: asStrokeType('line'), // Default to line if type is not present
      color: stroke.color || '#000000',
      thickness: stroke.thickness || 2,
      width: stroke.thickness || 2 // Use thickness as width if not present
    })) || [],
    walls: floorPlan.walls?.map(wall => ({
      id: wall.id,
      points: [wall.start, wall.end],
      start: wall.start,
      end: wall.end,
      thickness: wall.thickness || 1,
      color: '#000000', // Default color
      roomIds: [], // Default empty array
      length: wall.length || 0
    })) || [],
    rooms: floorPlan.rooms?.map(room => ({
      id: room.id,
      name: room.name || 'Unnamed Room',
      type: asRoomType('other'), // Default to other if type is not present
      points: [], // Default empty array
      color: '#ffffff', // Default color
      area: room.area || 0,
      level: 0, // Default level
      walls: [] // Default empty array
    })) || [],
    level: floorPlan.level || 0,
    gia: floorPlan.gia || 0,
    canvasData: floorPlan.canvasData ? JSON.stringify(floorPlan.canvasData) : null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    metadata: floorPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
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
  return appFloorPlans.map(floorPlan => ({
    ...floorPlan,
    label: floorPlan.label || floorPlan.name,
    // Convert canvasData from string to object if needed
    canvasData: typeof floorPlan.canvasData === 'string' ? floorPlan.canvasData : null,
    // Ensure compatibility with CoreFloorPlan
    data: floorPlan.data || {},
    userId: floorPlan.userId || ''
  })) as unknown as CoreFloorPlan[];
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
