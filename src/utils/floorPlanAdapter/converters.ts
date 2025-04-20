
/**
 * Floor plan converters
 * Converts between different floor plan formats
 * @module utils/floorPlanAdapter/converters
 */
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapt a partial floor plan to a complete floor plan
 * @param partial Partial floor plan
 * @returns Complete floor plan
 */
export const adaptFloorPlan = (partial: Partial<AppFloorPlan>): AppFloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Untitled Floor Plan',
    label: partial.label || partial.name || 'Untitled Floor Plan',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level: partial.level || 0,
    index: partial.index || partial.level || 0,
    metadata: partial.metadata || createCompleteMetadata({
      level: partial.level || 0
    }),
    data: partial.data || {},
    userId: partial.userId || 'unknown'
  };
};

/**
 * Convert app floor plan to core floor plan
 * @param appFloorPlan App floor plan
 * @returns Core floor plan
 */
export const appToCoreFloorPlan = (appFloorPlan: AppFloorPlan): CoreFloorPlan => {
  // In a real implementation, this would convert between types
  // For now, we're just type-casting
  return appFloorPlan as unknown as CoreFloorPlan;
};

/**
 * Convert multiple app floor plans to core floor plans
 * @param appFloorPlans Array of app floor plans
 * @returns Array of core floor plans
 */
export const appToCoreFloorPlans = (appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] => {
  return appFloorPlans.map(appToCoreFloorPlan);
};

/**
 * Convert core floor plan to app floor plan
 * @param coreFloorPlan Core floor plan
 * @returns App floor plan
 */
export const coreToAppFloorPlan = (coreFloorPlan: CoreFloorPlan): AppFloorPlan => {
  // In a real implementation, this would convert between types
  // For now, we're just type-casting and adding required fields
  const appFloorPlan = coreFloorPlan as unknown as AppFloorPlan;
  
  // Ensure required fields are present
  if (!appFloorPlan.data) {
    appFloorPlan.data = {};
  }
  
  if (!appFloorPlan.userId) {
    appFloorPlan.userId = 'unknown';
  }
  
  return appFloorPlan;
};

/**
 * Convert multiple core floor plans to app floor plans
 * @param coreFloorPlans Array of core floor plans
 * @returns Array of app floor plans
 */
export const coreToAppFloorPlans = (coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] => {
  return coreFloorPlans.map(coreToAppFloorPlan);
};
