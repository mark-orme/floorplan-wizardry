
/**
 * Type Adapters
 * Provides utility functions to adapt between incompatible type definitions
 * @module utils/typeAdapters
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall, Stroke as CoreStroke, StrokeType as CoreStrokeType } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall, Stroke as AppStroke, StrokeType as AppStrokeType } from '@/types/floorPlanTypes';
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
    rooms: Array.isArray(plan.rooms) ? plan.rooms : [],
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
    canvasJson: '',
    gia: plan.gia || 0,
    canvasData: plan.canvasData || null,
    level: plan.level || 0,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString()
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
    rooms: Array.isArray(plan.rooms) ? plan.rooms : [],
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
    }
  };
}

/**
 * Convert core stroke to app stroke
 */
export function coreToAppStroke(stroke: CoreStroke): AppStroke {
  // Map the stroke type from core to app
  let appStrokeType: AppStrokeType;
  switch (stroke.type) {
    case 'line':
    case 'wall':
    case 'room':
    case 'freehand':
    case 'polyline':
      appStrokeType = stroke.type;
      break;
    default:
      appStrokeType = 'LINE'; // Default to LINE if not matching
  }

  return {
    id: stroke.id,
    points: stroke.points,
    type: appStrokeType,
    color: stroke.color,
    thickness: stroke.thickness,
    width: stroke.thickness // Ensure width is set
  };
}

/**
 * Convert app stroke to core stroke
 */
export function appToCoreStroke(stroke: AppStroke): CoreStroke {
  // Map the stroke type from app to core
  let coreStrokeType: CoreStrokeType;
  switch (stroke.type) {
    case 'LINE':
      coreStrokeType = 'line';
      break;
    case 'POLYLINE':
      coreStrokeType = 'polyline';
      break;
    case 'CIRCLE':
    case 'RECTANGLE':
    case 'TEXT':
    case 'PATH':
      coreStrokeType = 'line'; // Map other types to line by default
      break;
    default:
      coreStrokeType = 'line';
  }

  return {
    id: stroke.id,
    points: stroke.points,
    type: coreStrokeType,
    color: stroke.color,
    thickness: stroke.width || stroke.thickness
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
    height: 0,
    color: wall.color,
    roomIds: []
  };
}

/**
 * Convert app wall to core wall
 */
export function appToCoreWall(wall: AppWall): CoreWall {
  return {
    id: wall.id,
    start: wall.startPoint,
    end: wall.endPoint,
    thickness: wall.thickness,
    color: wall.color || '#000000'
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
