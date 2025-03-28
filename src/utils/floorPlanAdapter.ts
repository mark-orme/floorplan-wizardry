
/**
 * Adapter utilities for converting between core.FloorPlan and floorPlanTypes.FloorPlan
 * @module utils/floorPlanAdapter
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall, Stroke as CoreStroke, Room as CoreRoom } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall, Stroke as AppStroke, Room as AppRoom, StrokeType } from '@/types/floorPlanTypes';

/**
 * Convert from app FloorPlan type to core FloorPlan type
 * @param appPlan The app FloorPlan
 * @returns The core FloorPlan
 */
export function appToCoreFloorPlan(appPlan: AppFloorPlan): CoreFloorPlan {
  // Convert wall format
  const walls = Array.isArray(appPlan.walls) 
    ? appPlan.walls.map(wall => ({
        id: wall.id,
        start: wall.startPoint || wall.start, // Use either property
        end: wall.endPoint || wall.end,     // Use either property
        thickness: wall.thickness,
        color: wall.color || '#000000',
        height: wall.height,
        roomIds: wall.roomIds
      } as CoreWall)) 
    : [];
  
  // Convert strokes and ensure each has width property
  const strokes = Array.isArray(appPlan.strokes) 
    ? appPlan.strokes.map(stroke => {
        // Convert enum to string type
        let strokeType: CoreStroke['type'];
        if (typeof stroke.type === 'string') {
          strokeType = stroke.type.toLowerCase() as CoreStroke['type'];
        } else {
          // Handle enum values
          switch (stroke.type) {
            case StrokeType.LINE:
              strokeType = 'line';
              break;
            case StrokeType.POLYLINE:
              strokeType = 'polyline';
              break;
            case StrokeType.WALL:
              strokeType = 'wall';
              break;
            case StrokeType.ROOM:
              strokeType = 'room';
              break; 
            case StrokeType.FREEHAND:
              strokeType = 'freehand';
              break;
            default:
              strokeType = 'line';
          }
        }

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
      createdAt: appPlan.metadata?.createdAt ? new Date(appPlan.metadata.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: appPlan.metadata?.updatedAt ? new Date(appPlan.metadata.updatedAt).toISOString() : new Date().toISOString(),
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
  // Convert wall format
  const walls = Array.isArray(corePlan.walls) 
    ? corePlan.walls.map(wall => ({
        id: wall.id,
        startPoint: wall.start, // Map start to startPoint
        endPoint: wall.end,     // Map end to endPoint
        start: wall.start,      // Keep original properties too
        end: wall.end,
        thickness: wall.thickness,
        height: wall.height || 0,
        color: wall.color,
        roomIds: wall.roomIds || []
      } as AppWall))
    : [];
    
  // Convert strokes and ensure each has required width
  const strokes = Array.isArray(corePlan.strokes)
    ? corePlan.strokes.map(stroke => {
        // Convert string stroke type to enum
        let strokeType: StrokeType;
        switch(stroke.type.toLowerCase()) {
          case 'line': strokeType = StrokeType.LINE; break;
          case 'polyline': strokeType = StrokeType.POLYLINE; break;
          case 'wall': strokeType = StrokeType.WALL; break;
          case 'room': strokeType = StrokeType.ROOM; break;
          case 'freehand': strokeType = StrokeType.FREEHAND; break;
          case 'path': strokeType = StrokeType.PATH; break;
          case 'circle': strokeType = StrokeType.CIRCLE; break;
          case 'rectangle': strokeType = StrokeType.RECTANGLE; break;
          case 'text': strokeType = StrokeType.TEXT; break;
          default: strokeType = StrokeType.LINE;
        }
        
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
  
  return {
    ...corePlan,
    label: corePlan.label, // Ensure label is preserved
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
    metadata: {
      createdAt: typeof corePlan.metadata?.createdAt === 'string' 
        ? new Date(corePlan.metadata.createdAt).getTime() 
        : Date.now(),
      updatedAt: typeof corePlan.metadata?.updatedAt === 'string' 
        ? new Date(corePlan.metadata.updatedAt).getTime() 
        : Date.now(),
      paperSize: corePlan.metadata?.paperSize || 'A4',
      level: corePlan.metadata?.level || 0
    },
    gia: corePlan.gia || 0,
    canvasData: corePlan.canvasData || null
  };
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
