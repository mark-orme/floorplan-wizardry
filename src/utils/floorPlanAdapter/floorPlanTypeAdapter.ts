
/**
 * Floor plan type adapter
 * Provides functions to convert between different floor plan formats
 * @module utils/floorPlanAdapter/floorPlanTypeAdapter
 */
import { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/core/floor-plan/AppFloorPlan';
import { FloorPlan as CanvasFloorPlan } from '@/types/floorPlanTypes';

/**
 * Convert a unified floor plan to app format
 * @param unifiedPlan Unified floor plan
 * @returns App floor plan
 */
export const convertToAppFloorPlan = (unifiedPlan: UnifiedFloorPlan): AppFloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: unifiedPlan.id,
    name: unifiedPlan.name,
    label: unifiedPlan.label || '',
    walls: unifiedPlan.walls.map(wall => ({
      id: wall.id,
      start: wall.start,
      end: wall.end,
      thickness: wall.thickness,
      color: wall.color,
      roomIds: wall.roomIds || []
    })),
    rooms: unifiedPlan.rooms,
    strokes: unifiedPlan.strokes,
    metadata: {
      createdAt: unifiedPlan.metadata?.createdAt || now,
      updatedAt: unifiedPlan.metadata?.updatedAt || now,
      paperSize: unifiedPlan.metadata?.paperSize,
      level: unifiedPlan.metadata?.level,
      version: unifiedPlan.metadata?.version,
      author: unifiedPlan.metadata?.author,
      lastModified: unifiedPlan.metadata?.lastModified || now,
      notes: unifiedPlan.metadata?.notes || ''
    },
    createdAt: unifiedPlan.createdAt || now,
    updatedAt: unifiedPlan.updatedAt || now
  };
};

/**
 * Convert multiple unified floor plans to app format
 * @param unifiedPlans Unified floor plans
 * @returns App floor plans
 */
export const convertToAppFloorPlans = (unifiedPlans: UnifiedFloorPlan[]): AppFloorPlan[] => {
  return unifiedPlans.map(convertToAppFloorPlan);
};

/**
 * Convert app floor plan to unified format
 * @param appPlan App floor plan
 * @returns Unified floor plan
 */
export const convertToUnifiedFloorPlan = (appPlan: AppFloorPlan): UnifiedFloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: appPlan.id,
    name: appPlan.name,
    label: appPlan.label || appPlan.name,
    walls: appPlan.walls,
    rooms: appPlan.rooms,
    strokes: appPlan.strokes,
    createdAt: appPlan.createdAt,
    updatedAt: appPlan.updatedAt,
    gia: 0,
    level: appPlan.metadata?.level || 0,
    index: 0,
    metadata: appPlan.metadata,
    data: {},
    userId: ''
  };
};

/**
 * Convert multiple app floor plans to unified format
 * @param appPlans App floor plans
 * @returns Unified floor plans
 */
export const convertToUnifiedFloorPlans = (appPlans: AppFloorPlan[]): UnifiedFloorPlan[] => {
  return appPlans.map(convertToUnifiedFloorPlan);
};

/**
 * Convert standard FloorPlan to canvas compatible FloorPlan
 */
export const convertToCanvasFloorPlan = (plan: UnifiedFloorPlan | AppFloorPlan): CanvasFloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: plan.id,
    name: plan.name,
    label: plan.label || plan.name,
    walls: plan.walls,
    rooms: plan.rooms,
    strokes: plan.strokes,
    index: 'index' in plan ? plan.index : 0,
    level: 'level' in plan ? plan.level : 0,
    canvasData: null,
    canvasJson: null,
    gia: 'gia' in plan ? plan.gia : 0,
    createdAt: 'createdAt' in plan ? plan.createdAt : now,
    updatedAt: 'updatedAt' in plan ? plan.updatedAt : now,
    metadata: plan.metadata,
    data: 'data' in plan ? plan.data : {},
    userId: 'userId' in plan ? plan.userId : '',
    propertyId: 'propertyId' in plan ? plan.propertyId : ''
  };
};

/**
 * Convert canvas FloorPlan to unified format
 */
export const convertFromCanvasFloorPlan = (canvasPlan: CanvasFloorPlan): UnifiedFloorPlan => {
  return {
    id: canvasPlan.id,
    name: canvasPlan.name,
    label: canvasPlan.label,
    walls: canvasPlan.walls,
    rooms: canvasPlan.rooms,
    strokes: canvasPlan.strokes,
    gia: canvasPlan.gia,
    level: canvasPlan.level,
    index: canvasPlan.index,
    createdAt: canvasPlan.createdAt,
    updatedAt: canvasPlan.updatedAt,
    metadata: canvasPlan.metadata,
    data: canvasPlan.data,
    userId: canvasPlan.userId,
    canvasData: canvasPlan.canvasData,
    canvasJson: canvasPlan.canvasJson
  };
};
