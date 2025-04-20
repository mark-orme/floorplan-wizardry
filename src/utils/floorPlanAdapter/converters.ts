
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapts a FloorPlan from one type to another
 * @param floorPlan Floor plan to adapt
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(floorPlan: Partial<CoreFloorPlan>): AppFloorPlan {
  return {
    id: floorPlan.id || uuidv4(),
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || '',
    index: floorPlan.index || 0,
    strokes: floorPlan.strokes?.map(stroke => ({
      ...stroke,
      type: stroke.type || 'line',
      width: stroke.width || stroke.thickness || 2
    })) || [],
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    level: floorPlan.level || 0,
    gia: floorPlan.gia || 0,
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: floorPlan.createdAt || new Date().toISOString(),
    updatedAt: floorPlan.updatedAt || new Date().toISOString(),
    metadata: floorPlan.metadata || {
      version: '1.0',
      author: '',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: ''
    },
    // Add the missing required properties
    data: floorPlan.data || {},
    userId: floorPlan.userId || ''
  };
}

/**
 * Converts app floor plans to core floor plans
 * @param appFloorPlans App floor plans to convert
 * @returns Core floor plans
 */
export function appToCoreFloorPlans(appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appFloorPlans.map(floorPlan => ({
    ...floorPlan,
    label: floorPlan.label || floorPlan.name,
    // Ensure compatibility with CoreFloorPlan
    data: floorPlan.data,
    userId: floorPlan.userId
  }));
}

/**
 * Converts core floor plans to app floor plans
 * @param coreFloorPlans Core floor plans to convert
 * @returns App floor plans
 */
export function coreToAppFloorPlans(coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] {
  return coreFloorPlans.map(adaptFloorPlan);
}
