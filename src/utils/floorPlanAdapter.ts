
/**
 * Utility for adapting floor plan formats between different parts of the application
 */
import { FloorPlan } from '@/types/floorPlanTypes';

/**
 * Convert application floor plans to core floor plans format
 * @param floorPlans - Application floor plans
 * @returns Core floor plans
 */
export const appToCoreFloorPlans = (floorPlans: any[]): FloorPlan[] => {
  return floorPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    label: plan.name,
    data: plan.data || {},
    userId: plan.userId || 'anonymous',
    walls: plan.walls || [],
    rooms: plan.rooms || [],
    strokes: plan.strokes || [],
    canvasJson: plan.canvasJson || null,
    canvasData: plan.canvasData || null,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
    gia: plan.gia || 0,
    level: plan.level || 0,
    index: plan.index || 0,
    metadata: {
      createdAt: plan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: plan.metadata?.updatedAt || new Date().toISOString(),
      paperSize: plan.metadata?.paperSize || 'A4',
      level: plan.metadata?.level || 0
    }
  }));
};

/**
 * Convert core floor plans to application format
 * @param floorPlans - Core floor plans
 * @returns Application floor plans
 */
export const coreToAppFloorPlans = (floorPlans: FloorPlan[]): any[] => {
  return floorPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    data: plan.data,
    userId: plan.userId,
    walls: plan.walls,
    rooms: plan.rooms,
    strokes: plan.strokes,
    canvasJson: plan.canvasJson,
    canvasData: plan.canvasData,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    gia: plan.gia,
    level: plan.level,
    index: plan.index,
    metadata: plan.metadata
  }));
};
