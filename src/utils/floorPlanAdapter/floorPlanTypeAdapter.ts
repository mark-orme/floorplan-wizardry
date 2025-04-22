
/**
 * Floor plan type adapter
 * Provides functions to convert between different floor plan formats
 * @module utils/floorPlanAdapter/floorPlanTypeAdapter
 */
import { 
  FloorPlan as UnifiedFloorPlan, 
  Wall, 
  Room, 
  Stroke,
  asStrokeType,
  asRoomType
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
    createdAt: unifiedPlan.createdAt || now,
    updatedAt: unifiedPlan.updatedAt || now,
    metadata: {
      createdAt: unifiedPlan.metadata?.createdAt || now,
      updatedAt: unifiedPlan.metadata?.updatedAt || now,
      author: unifiedPlan.metadata?.author || 'User',
      version: unifiedPlan.metadata?.version || '1.0',
      paperSize: unifiedPlan.metadata?.paperSize,
      level: unifiedPlan.metadata?.level,
      notes: unifiedPlan.metadata?.notes || ''
    }
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
    walls: appPlan.walls || [],
    rooms: appPlan.rooms || [],
    strokes: appPlan.strokes || [],
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: 0,
    level: appPlan.metadata?.level || 0,
    index: 0,
    metadata: {
      createdAt: appPlan.metadata?.createdAt || now,
      updatedAt: appPlan.metadata?.updatedAt || now,
      paperSize: appPlan.metadata?.paperSize || 'A4',
      level: appPlan.metadata?.level || 0,
      version: appPlan.metadata?.version || '1.0',
      author: appPlan.metadata?.author || 'User',
      notes: appPlan.metadata?.notes || '',
      dateCreated: appPlan.metadata?.dateCreated || now,
      lastModified: appPlan.metadata?.lastModified || now
    },
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
  const now = new Date().toISOString();
  // Ensure proper conversion with all required fields
  return {
    id: canvasPlan.id || '',
    name: canvasPlan.name || '',
    label: canvasPlan.label || canvasPlan.name || '',
    walls: canvasPlan.walls || [],
    rooms: canvasPlan.rooms || [],
    strokes: canvasPlan.strokes || [],
    createdAt: canvasPlan.createdAt || now,
    updatedAt: canvasPlan.updatedAt || now,
    gia: canvasPlan.gia || 0,
    level: canvasPlan.level || 0,
    index: canvasPlan.index || 0,
    metadata: canvasPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'User',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
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
  const now = new Date().toISOString();
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
    createdAt: unifiedPlan.createdAt || now,
    updatedAt: unifiedPlan.updatedAt || now,
    metadata: unifiedPlan.metadata,
    data: unifiedPlan.data || {},
    userId: unifiedPlan.userId || '',
    propertyId: unifiedPlan.propertyId || unifiedPlan.userId || ''
  };
};

/**
 * Convert any floor plan to the unified format
 * Smart function that detects the format and converts appropriately
 * @param floorPlan Any floor plan object
 * @returns Unified floor plan
 */
export const toUnifiedFloorPlan = (floorPlan: any): UnifiedFloorPlan => {
  // Detect if this is already a unified floor plan
  if (floorPlan && floorPlan.data !== undefined && floorPlan.userId !== undefined) {
    // Already appears to be in unified format
    return ensureUnifiedFloorPlanIntegrity(floorPlan);
  }
  
  // Try to convert from canvas or app format
  if (floorPlan.propertyId) {
    // Likely a canvas floor plan
    return convertCanvasToUnifiedFloorPlan(floorPlan);
  }
  
  // Attempt conversion from app format
  return convertToUnifiedFloorPlan(floorPlan as any);
};

/**
 * Ensure a floor plan has all required unified format properties
 * @param floorPlan Potentially incomplete floor plan
 * @returns Complete unified floor plan
 */
function ensureUnifiedFloorPlanIntegrity(floorPlan: Partial<UnifiedFloorPlan>): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || `floor-plan-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    metadata: floorPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'User',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
    data: floorPlan.data || {},
    userId: floorPlan.userId || ''
  };
}
