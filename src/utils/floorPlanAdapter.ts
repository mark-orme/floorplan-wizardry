
/**
 * Adapter utilities for converting between core.FloorPlan and floorPlanTypes.FloorPlan
 * @module utils/floorPlanAdapter
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall, Stroke as CoreStroke, Room as CoreRoom, StrokeType as CoreStrokeType } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall, Stroke as AppStroke, Room as AppRoom, StrokeTypeLiteral } from '@/types/floorPlanTypes';
import { createPoint } from '@/types/core/Point';

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
        
        return {
          id: wall.id,
          start,
          end,
          thickness: wall.thickness || 1,
          color: wall.color || '#000000',
          height: wall.height,
          roomIds: wall.roomIds
        } as CoreWall;
      }) 
    : [];
  
  // Convert strokes and ensure each has width property
  const strokes = Array.isArray(appPlan.strokes) 
    ? appPlan.strokes.map(stroke => {
        // Convert string literal to core type directly
        const strokeType = stroke.type as CoreStrokeType;

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
      name: room.name,
      type: (room.type as CoreRoom['type']) || 'other',
      points: room.points,
      color: room.color || '#ffffff',
      area: room.area || 0
    } as CoreRoom)) : [],
    strokes: strokes,
    canvasData: appPlan.canvasData || null,
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
    },
    paperSize: appPlan.paperSize || 'A4',
    canvasJson: appPlan.canvasJson || ''
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
        const start = wall.start || createPoint(0, 0);
        const end = wall.end || createPoint(0, 0);
        
        return {
          id: wall.id,
          points: [start, end], // Required property
          startPoint: start, // Map start to startPoint
          endPoint: end,     // Map end to endPoint
          start: start,      // Keep original properties too
          end: end,
          thickness: wall.thickness,
          height: wall.height || 0,
          color: wall.color,
          roomIds: wall.roomIds || []
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
      name: room.name,
      type: room.type,
      points: room.points,
      color: room.color,
      area: room.area || 0,
      level: corePlan.level || 0
    } as AppRoom)) : [],
    index: corePlan.index || 0,
    level: corePlan.level || 0,
    metadata: {
      createdAt: corePlan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: corePlan.metadata?.updatedAt || new Date().toISOString(),
      paperSize: corePlan.metadata?.paperSize || 'A4',
      level: corePlan.metadata?.level || 0
    },
    gia: corePlan.gia || 0,
    canvasData: corePlan.canvasData || null,
    canvasJson: corePlan.canvasJson || null,
    createdAt: corePlan.createdAt || new Date().toISOString(),
    updatedAt: corePlan.updatedAt || new Date().toISOString()
  };
  
  return appFloorPlan;
}

/**
 * Validate and convert a string to a valid StrokeTypeLiteral
 * @param type The string type to validate
 * @returns A valid StrokeTypeLiteral
 */
function validateStrokeType(type: string): StrokeTypeLiteral {
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
