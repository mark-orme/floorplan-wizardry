
/**
 * Floor plan type adapter
 * Provides functions to convert between different floor plan formats
 * @module utils/floorPlanAdapter/floorPlanTypeAdapter
 */
import { 
  FloorPlan as UnifiedFloorPlan, 
  Wall, 
  Room, 
  Stroke
} from '@/types/floor-plan/unifiedTypes';
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
      author: unifiedPlan.metadata?.author || 'User',
      version: unifiedPlan.metadata?.version || '1.0',
      paperSize: unifiedPlan.metadata?.paperSize,
      level: unifiedPlan.metadata?.level,
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
 * Convert canvas-compatible FloorPlan to the unified format
 * Used to ensure compatibility across the application
 * @param canvasPlan Canvas floor plan
 * @returns Unified floor plan
 */
export const convertCanvasToUnifiedFloorPlan = (canvasPlan: CanvasFloorPlan): UnifiedFloorPlan => {
  // Ensure proper conversion with all required fields
  return {
    id: canvasPlan.id,
    name: canvasPlan.name,
    label: canvasPlan.label || canvasPlan.name,
    walls: canvasPlan.walls || [],
    rooms: canvasPlan.rooms || [],
    strokes: canvasPlan.strokes || [],
    createdAt: canvasPlan.createdAt,
    updatedAt: canvasPlan.updatedAt,
    gia: canvasPlan.gia || 0,
    level: canvasPlan.level || 0,
    index: canvasPlan.index || 0,
    metadata: canvasPlan.metadata,
    data: canvasPlan.data || {},
    userId: canvasPlan.userId || '',
    canvasData: canvasPlan.canvasData,
    canvasJson: canvasPlan.canvasJson
  };
};

/**
 * Convert unified FloorPlan to canvas-compatible format
 * Used for rendering in the canvas
 * @param unifiedPlan Unified floor plan
 * @returns Canvas floor plan
 */
export const convertUnifiedToCanvasFloorPlan = (unifiedPlan: UnifiedFloorPlan): CanvasFloorPlan => {
  return {
    id: unifiedPlan.id,
    name: unifiedPlan.name,
    label: unifiedPlan.label || unifiedPlan.name,
    walls: unifiedPlan.walls,
    rooms: unifiedPlan.rooms,
    strokes: unifiedPlan.strokes,
    index: unifiedPlan.index || 0,
    level: unifiedPlan.level || 0,
    canvasData: unifiedPlan.canvasData || null,
    canvasJson: unifiedPlan.canvasJson || null,
    gia: unifiedPlan.gia || 0,
    createdAt: unifiedPlan.createdAt,
    updatedAt: unifiedPlan.updatedAt,
    metadata: unifiedPlan.metadata,
    data: unifiedPlan.data || {},
    userId: unifiedPlan.userId || '',
    propertyId: unifiedPlan.propertyId || unifiedPlan.userId || ''
  };
};
