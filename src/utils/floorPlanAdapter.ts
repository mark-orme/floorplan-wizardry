
/**
 * Floor Plan Type Adapter
 * Provides utilities for converting between core and app floor plan types
 * @module utils/floorPlanAdapter
 */
import { 
  FloorPlan as CoreFloorPlan, 
  Room as CoreRoom, 
  Wall as CoreWall, 
  Stroke as CoreStroke,
  StrokeType as CoreStrokeType,
  PaperSize as CorePaperSize
} from '@/types/core/FloorPlan';

import { 
  FloorPlan as AppFloorPlan, 
  Room as AppRoom, 
  Wall as AppWall, 
  Stroke as AppStroke,
  StrokeType as AppStrokeType,
  PaperSize as AppPaperSize
} from '@/types/floorPlanTypes';

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
      createdAt: typeof plan.metadata?.createdAt === 'string' 
        ? new Date(plan.metadata.createdAt).getTime() 
        : Date.now(),
      updatedAt: typeof plan.metadata?.updatedAt === 'string' 
        ? new Date(plan.metadata.updatedAt).getTime() 
        : Date.now(),
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
      createdAt: plan.metadata?.createdAt ? new Date(plan.metadata.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: plan.metadata?.updatedAt ? new Date(plan.metadata.updatedAt).toISOString() : new Date().toISOString(),
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
  // Convert string type to enum
  let appStrokeType: AppStrokeType;
  
  switch (stroke.type) {
    case 'line':
      appStrokeType = AppStrokeType.LINE;
      break;
    case 'polyline':
      appStrokeType = AppStrokeType.POLYLINE;
      break;
    case 'wall':
      appStrokeType = AppStrokeType.WALL;
      break;
    case 'room':
      appStrokeType = AppStrokeType.ROOM;
      break;
    case 'freehand':
      appStrokeType = AppStrokeType.FREEHAND;
      break;
    default:
      appStrokeType = AppStrokeType.LINE;
      break;
  }

  return {
    id: stroke.id,
    points: stroke.points,
    type: appStrokeType,
    color: stroke.color,
    thickness: stroke.thickness,
    width: stroke.thickness || stroke.width || 1 // Ensure width is set
  };
}

/**
 * Convert app stroke to core stroke
 */
export function appToCoreStroke(stroke: AppStroke): CoreStroke {
  // Convert enum to string type
  let coreStrokeType: CoreStrokeType;
  
  if (typeof stroke.type === 'string') {
    switch (stroke.type.toUpperCase()) {
      case 'LINE':
        coreStrokeType = 'line';
        break;
      case 'POLYLINE':
        coreStrokeType = 'polyline';
        break;
      case 'WALL':
        coreStrokeType = 'wall';
        break;
      case 'ROOM':
        coreStrokeType = 'room';
        break;
      case 'FREEHAND':
        coreStrokeType = 'freehand';
        break;
      default:
        coreStrokeType = 'line';
        break;
    }
  } else {
    // Handle enum values
    switch (stroke.type) {
      case AppStrokeType.LINE:
        coreStrokeType = 'line';
        break;
      case AppStrokeType.POLYLINE:
        coreStrokeType = 'polyline';
        break;
      case AppStrokeType.WALL:
        coreStrokeType = 'wall';
        break;
      case AppStrokeType.ROOM:
        coreStrokeType = 'room';
        break;
      case AppStrokeType.FREEHAND:
        coreStrokeType = 'freehand';
        break;
      default:
        coreStrokeType = 'line';
        break;
    }
  }

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
  const roomType: CoreRoom['type'] = (typeof room.type === 'string' && 
    ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'].includes(room.type)) 
      ? (room.type as CoreRoom['type']) 
      : 'other';
  
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
    thickness: wall.thickness,
    height: wall.height || 0,
    color: wall.color,
    roomIds: wall.roomIds || []
  };
}

/**
 * Convert app wall to core wall
 */
export function appToCoreWall(wall: AppWall): AppWall['startPoint'] extends CoreWall['start'] 
  ? CoreWall 
  : never {
  return {
    id: wall.id,
    start: wall.startPoint,
    end: wall.endPoint,
    thickness: wall.thickness,
    color: wall.color || '#000000',
    height: wall.height,
    roomIds: wall.roomIds
  } as any;
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

/**
 * Map paper size between formats
 */
export function mapPaperSizeToApp(paperSize: string | CorePaperSize): AppPaperSize {
  switch (paperSize) {
    case CorePaperSize.A3:
      return AppPaperSize.A3;
    case CorePaperSize.A4:
      return AppPaperSize.A4;
    case CorePaperSize.A5:
      return AppPaperSize.A5;
    default:
      return AppPaperSize.A4;
  }
}
