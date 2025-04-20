
/**
 * Adapter for FloorPlan objects to ensure compatibility across the application
 */
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan as FloorPlanType } from '@/types/FloorPlan';
import { FloorPlan as FloorPlanTypesType } from '@/types/floorPlanTypes';

/**
 * Adapt a FloorPlan to ensure it has all required properties
 * @param floorPlan The floor plan to adapt
 * @returns An adapted floor plan with all required properties
 */
export function adaptFloorPlan(floorPlan: any): FloorPlanType {
  // If no floor plan or not an object, return a default floor plan
  if (!floorPlan || typeof floorPlan !== 'object') {
    return createDefaultFloorPlan();
  }
  
  // Ensure we have the required properties
  return {
    id: floorPlan.id || `floor-plan-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled Floor Plan',
    data: floorPlan.data || {},
    userId: floorPlan.userId || floorPlan.user_id || 'unknown-user',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    canvasJson: floorPlan.canvasJson || null,
    canvasData: floorPlan.canvasData || null,
    createdAt: floorPlan.createdAt || floorPlan.created_at || new Date().toISOString(),
    updatedAt: floorPlan.updatedAt || floorPlan.updated_at || new Date().toISOString(),
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || floorPlan.level || 0,
    metadata: floorPlan.metadata || {
      createdAt: floorPlan.createdAt || new Date().toISOString(),
      updatedAt: floorPlan.updatedAt || new Date().toISOString(),
      paperSize: 'A4',
      level: floorPlan.level || 0
    }
  };
}

/**
 * Create a default floor plan object
 * @returns A default floor plan
 */
export function createDefaultFloorPlan(): FloorPlanType {
  const now = new Date().toISOString();
  
  return {
    id: `floor-plan-${Date.now()}`,
    name: 'Untitled Floor Plan',
    label: 'Untitled Floor Plan',
    data: {},
    userId: 'unknown-user',
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0
    }
  };
}

/**
 * Normalize DrawingMode values for consistent usage
 * @param mode The drawing mode value
 * @returns A normalized drawing mode
 */
export function normalizeDrawingMode(mode: any): DrawingMode {
  if (!mode) {
    return DrawingMode.SELECT;
  }
  
  if (typeof mode === 'string') {
    // Look for a matching key in DrawingMode
    for (const key in DrawingMode) {
      if (DrawingMode[key as keyof typeof DrawingMode].toLowerCase() === mode.toLowerCase()) {
        return DrawingMode[key as keyof typeof DrawingMode];
      }
    }
  }
  
  return DrawingMode.SELECT;
}
