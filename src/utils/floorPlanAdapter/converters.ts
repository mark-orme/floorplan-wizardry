/**
 * Floor Plan Adapter Converters
 * Conversion functions between app and core floor plan types
 * @module utils/floorPlanAdapter/converters
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall, Stroke as CoreStroke, Room as CoreRoom } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall, Stroke as AppStroke, Room as AppRoom, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floorPlanTypes';
import { Point, createPoint } from '@/types/core/Point';
import { validateStrokeType, mapRoomType, validateRoomType } from './types';
import { validatePoint, validateTimestamp, validateColor } from './validators';
import { Point as GeometryPoint } from '@/types/geometryTypes';

/**
 * Calculate distance between two points
 * @param start Start point
 * @param end End point
 * @returns Distance between points
 */
function calculateDistance(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert from app FloorPlan type to core FloorPlan type
 * @param appPlan The app FloorPlan
 * @returns The core FloorPlan
 */
export function appToCoreFloorPlan(appPlan: AppFloorPlan): CoreFloorPlan {
  // Convert wall format
  const walls = Array.isArray(appPlan.walls) 
    ? appPlan.walls.map(wall => {
        const start = wall.start || (wall.points && wall.points.length > 0 ? wall.points[0] : createPoint(0, 0));
        const end = wall.end || (wall.points && wall.points.length > 1 ? wall.points[1] : createPoint(0, 0));
        
        // Calculate length if not already present
        const length = wall.length !== undefined ? wall.length : calculateDistance(start, end);
        
        return {
          id: wall.id,
          start,
          end,
          thickness: wall.thickness || 1, // Provide default if missing
          color: wall.color || '#000000', // Provide default if missing
          height: wall.height,
          roomIds: wall.roomIds,
          length
        } as CoreWall;
      }) 
    : [];
  
  // Convert strokes and ensure each has width property
  const strokes = Array.isArray(appPlan.strokes) 
    ? appPlan.strokes.map(stroke => {
        // Convert string literal to core type directly
        const strokeType = stroke.type as CoreStroke['type'];

        return {
          id: stroke.id,
          points: stroke.points,
          type: strokeType,
          color: stroke.color,
          thickness: stroke.thickness,
          width: stroke.width || stroke.thickness // Ensure width is set
        } as CoreStroke;
      })
    : [];
  
  return {
    id: appPlan.id,
    name: appPlan.name,
    label: appPlan.label || appPlan.name, // Ensure label is always set
    walls: walls,
    rooms: Array.isArray(appPlan.rooms) ? appPlan.rooms.map(room => ({
      id: room.id,
      name: room.name || 'Unnamed Room', // Ensure name is always set
      type: validateRoomType(room.type), // Use validateRoomType to ensure the type is valid
      points: room.points,
      color: room.color || '#ffffff',
      area: room.area // Area is now required in the Room interface
    } as CoreRoom)) : [],
    strokes: strokes,
    canvasData: appPlan.canvasData || null,
    canvasJson: appPlan.canvasJson || '',
    createdAt: appPlan.createdAt || new Date().toISOString(),
    updatedAt: appPlan.updatedAt || new Date().toISOString(),
    gia: appPlan.gia || 0,
    level: appPlan.level || appPlan.index || 0,
    index: appPlan.index || 0, // Ensure index is always set
    metadata: {
      createdAt: typeof appPlan.metadata?.createdAt === 'string' 
        ? appPlan.metadata.createdAt 
        : new Date().toISOString(),
      updatedAt: typeof appPlan.metadata?.updatedAt === 'string' 
        ? appPlan.metadata.updatedAt 
        : new Date().toISOString(),
      paperSize: appPlan.metadata?.paperSize || 'A4',
      level: appPlan.metadata?.level || 0
    }
  };
}

/**
 * Convert from core FloorPlan type to app FloorPlan type
 * @param corePlan The core FloorPlan
 * @returns The app FloorPlan
 */
export function coreToAppFloorPlan(corePlan: CoreFloorPlan): AppFloorPlan {
  // Convert wall format - ensuring both start/end and startPoint/endPoint are provided
  const walls = Array.isArray(corePlan.walls) 
    ? corePlan.walls.map(wall => {
        const start = validatePoint(wall.start);
        const end = validatePoint(wall.end);
        
        return {
          id: wall.id,
          points: [start, end], // Ensure points are present
          startPoint: start, // Set startPoint from start
          endPoint: end, // Set endPoint from end
          start: start, // Ensure start is present
          end: end, // Ensure end is present
          thickness: wall.thickness || 1, // Ensure thickness is present
          height: wall.height || 0,
          color: validateColor(wall.color, '#000000'),
          roomIds: wall.roomIds || [],
          length: wall.length || calculateDistance(start, end) // Ensure length is present
        } as AppWall;
      })
    : [];
    
  // Convert strokes ensuring type is valid StrokeTypeLiteral
  const strokes = Array.isArray(corePlan.strokes)
    ? corePlan.strokes.map(stroke => {
        // Convert string stroke type to StrokeTypeLiteral
        const strokeType: StrokeTypeLiteral = validateStrokeType(stroke.type);
        
        return {
          id: stroke.id,
          points: stroke.points,
          type: strokeType,
          color: stroke.color,
          thickness: stroke.thickness,
          width: stroke.width || stroke.thickness // Ensure width is set
        } as AppStroke;
      })
    : [];
  
  // Create a proper AppFloorPlan with required properties
  const appFloorPlan: AppFloorPlan = {
    id: corePlan.id,
    name: corePlan.name,
    label: corePlan.label || corePlan.name || '', // Ensure label is preserved and required
    strokes: strokes,
    walls: walls,
    rooms: Array.isArray(corePlan.rooms) ? corePlan.rooms.map(room => ({
      id: room.id,
      name: room.name || 'Unnamed Room', // Ensure name is always set
      type: mapRoomType(room.type) as RoomTypeLiteral, // Convert RoomType to RoomTypeLiteral
      points: room.points,
      color: validateColor(room.color, '#ffffff'),
      area: room.area, // Area is now required in the Room interface
      level: corePlan.level || 0 // Set the level property from the floor plan
    } as AppRoom)) : [],
    index: corePlan.index || 0,
    level: corePlan.level || 0,
    metadata: {
      createdAt: validateTimestamp(corePlan.metadata?.createdAt),
      updatedAt: validateTimestamp(corePlan.metadata?.updatedAt),
      paperSize: corePlan.metadata?.paperSize || 'A4',
      level: corePlan.metadata?.level || 0
    },
    gia: corePlan.gia || 0,
    canvasData: corePlan.canvasData || null,
    canvasJson: corePlan.canvasJson || null,
    createdAt: validateTimestamp(corePlan.createdAt),
    updatedAt: validateTimestamp(corePlan.updatedAt)
  };
  
  return appFloorPlan;
}

/**
 * Convert multiple app FloorPlans to core FloorPlans
 * @param appPlans Array of app FloorPlans
 * @returns Array of core FloorPlans
 */
export function appToCoreFloorPlans(appPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appPlans.map(appToCoreFloorPlan);
}

/**
 * Convert multiple core FloorPlans to app FloorPlans
 * @param corePlans Array of core FloorPlans
 * @returns Array of app FloorPlans
 */
export function coreToAppFloorPlans(corePlans: CoreFloorPlan[]): AppFloorPlan[] {
  return corePlans.map(coreToAppFloorPlan);
}
