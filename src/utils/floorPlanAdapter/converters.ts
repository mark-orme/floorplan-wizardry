
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { FloorPlan as AppFloorPlan, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/typesBarrel';
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
      ...stroke,
      type: asStrokeType(stroke.type as string || 'line'),
      width: stroke.width || stroke.thickness || 2
    })) || [],
    walls: floorPlan.walls?.map(wall => ({
      ...wall,
      points: wall.points || [wall.start, wall.end],
      color: wall.color || '#000000',
      roomIds: wall.roomIds || []
    })) || [],
    rooms: floorPlan.rooms?.map(room => ({
      ...room,
      type: asRoomType(room.type as string || 'other'),
      points: room.points || [],
      color: room.color || '#ffffff',
      level: room.level || 0,
      walls: room.walls || []
    })) || [],
    level: floorPlan.level || 0,
    gia: floorPlan.gia || 0,
    canvasData: floorPlan.canvasData || null,
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
    // Ensure compatibility with CoreFloorPlan
    data: floorPlan.data || {},
    userId: floorPlan.userId || ''
  } as unknown as CoreFloorPlan));
}

/**
 * Converts core floor plans to app floor plans
 * @param coreFloorPlans Core floor plans to convert
 * @returns App floor plans
 */
export function coreToAppFloorPlans(coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] {
  return coreFloorPlans.map(floorPlan => adaptFloorPlan(floorPlan as unknown as Partial<CoreFloorPlan>));
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
