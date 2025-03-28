
/**
 * Type Adapters
 * Provides utility functions to adapt between incompatible type definitions
 * @module utils/typeAdapters
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall, Stroke as CoreStroke, StrokeType as CoreStrokeType, Room as CoreRoom, RoomType as CoreRoomType } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall, Stroke as AppStroke, StrokeType as AppStrokeType, Room as AppRoom, PaperSize, StrokeTypeLiteral } from '@/types/floorPlanTypes';
import { Point } from '@/types/geometryTypes';

/**
 * Convert a core floor plan to app floor plan format
 * @param plan Core floor plan
 * @returns App floor plan
 */
export function coreToAppFloorPlan(plan: CoreFloorPlan): AppFloorPlan {
  return {
    id: plan.id,
    name: plan.name,
    label: plan.label || plan.name,
    index: typeof plan.level !== 'undefined' ? Number(plan.level) : 0,
    strokes: Array.isArray(plan.strokes) ? plan.strokes.map(coreToAppStroke) : [],
    walls: Array.isArray(plan.walls) ? plan.walls.map(coreToAppWall) : [],
    rooms: Array.isArray(plan.rooms) ? plan.rooms.map(coreToAppRoom) : [],
    metadata: {
      createdAt: plan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: plan.metadata?.updatedAt || new Date().toISOString(),
      paperSize: plan.metadata?.paperSize || 'A4',
      level: plan.metadata?.level || 0
    },
    canvasJson: plan.canvasJson || '',
    gia: plan.gia || 0,
    canvasData: plan.canvasData || null,
    level: plan.level || 0,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
    paperSize: plan.paperSize || 'A4'
  };
}

/**
 * Convert an app floor plan to core floor plan format
 * @param plan App floor plan
 * @returns Core floor plan
 */
export function appToCoreFloorPlan(plan: AppFloorPlan): CoreFloorPlan {
  return {
    id: plan.id,
    name: plan.name,
    label: plan.label || plan.name,
    walls: Array.isArray(plan.walls) ? plan.walls.map(appToCoreWall) : [],
    rooms: Array.isArray(plan.rooms) ? plan.rooms.map(appToCoreRoom) : [],
    strokes: Array.isArray(plan.strokes) ? plan.strokes.map(appToCoreStroke) : [],
    canvasData: plan.canvasData || null,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
    gia: plan.gia || 0,
    level: plan.level || plan.index || 0,
    metadata: {
      createdAt: typeof plan.metadata?.createdAt === 'string'
        ? plan.metadata.createdAt
        : new Date().toISOString(),
      updatedAt: typeof plan.metadata?.updatedAt === 'string'
        ? plan.metadata.updatedAt
        : new Date().toISOString(),
      paperSize: plan.metadata?.paperSize || 'A4',
      level: plan.metadata?.level || 0
    },
    paperSize: plan.paperSize || 'A4',
    canvasJson: plan.canvasJson || '',
    index: plan.index
  };
}

/**
 * Convert core stroke to app stroke
 */
export function coreToAppStroke(stroke: CoreStroke): AppStroke {
  // Convert string type to valid StrokeTypeLiteral
  let appStrokeType: StrokeTypeLiteral;
  
  switch (stroke.type) {
    case 'line':
      appStrokeType = 'line';
      break;
    case 'polyline':
      appStrokeType = 'polyline';
      break;
    case 'wall':
      appStrokeType = 'wall';
      break;
    case 'room':
      appStrokeType = 'room';
      break;
    case 'freehand':
      appStrokeType = 'freehand';
      break;
    default:
      appStrokeType = 'line';
      break;
  }

  return {
    id: stroke.id,
    points: stroke.points,
    type: appStrokeType,
    color: stroke.color,
    thickness: stroke.thickness,
    width: stroke.width || stroke.thickness // Ensure width is set
  };
}

/**
 * Convert app stroke to core stroke
 */
export function appToCoreStroke(stroke: AppStroke): CoreStroke {
  // Convert enum or literal to core string type
  let coreStrokeType: CoreStrokeType = stroke.type as CoreStrokeType;

  return {
    id: stroke.id,
    points: stroke.points,
    type: coreStrokeType,
    color: stroke.color,
    thickness: stroke.width || stroke.thickness,
    width: stroke.width || stroke.thickness
  };
}

/**
 * Convert core room to app room
 */
export function coreToAppRoom(room: CoreRoom): AppRoom {
  return {
    id: room.id,
    name: room.name,
    type: room.type || 'other',
    points: room.points,
    color: room.color,
    area: room.area || 0,
    level: 0
  };
}

/**
 * Convert app room to core room
 */
export function appToCoreRoom(room: AppRoom): CoreRoom {
  let roomType: CoreRoomType = 'other';
  
  if (typeof room.type === 'string') {
    // Check if the type is one of the allowed RoomType values
    if (['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'].includes(room.type)) {
      roomType = room.type as CoreRoomType;
    }
  }
  
  return {
    id: room.id,
    name: room.name,
    type: roomType,
    points: room.points,
    color: room.color || '#ffffff',
    area: room.area || 0
  };
}

/**
 * Convert core wall to app wall
 */
export function coreToAppWall(wall: CoreWall): AppWall {
  return {
    id: wall.id,
    startPoint: wall.start,
    endPoint: wall.end,
    start: wall.start, // Ensure start is included
    end: wall.end,     // Ensure end is included
    thickness: wall.thickness,
    height: wall.height || 0,
    color: wall.color,
    roomIds: wall.roomIds || []
  };
}

/**
 * Convert app wall to core wall
 */
export function appToCoreWall(wall: AppWall): CoreWall {
  return {
    id: wall.id,
    start: wall.startPoint || wall.start, // Use either startPoint or start
    end: wall.endPoint || wall.end,      // Use either endPoint or end
    thickness: wall.thickness,
    color: wall.color || '#000000',
    height: wall.height,
    roomIds: wall.roomIds
  };
}

/**
 * Convert an array of core floor plans to app floor plans
 */
export function coreToAppFloorPlans(plans: CoreFloorPlan[]): AppFloorPlan[] {
  return plans.map(coreToAppFloorPlan);
}

/**
 * Convert an array of app floor plans to core floor plans
 */
export function appToCoreFloorPlans(plans: AppFloorPlan[]): CoreFloorPlan[] {
  return plans.map(appToCoreFloorPlan);
}
