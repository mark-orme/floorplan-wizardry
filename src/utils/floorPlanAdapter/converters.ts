
import { FloorPlan, PaperSize } from '@/types/FloorPlan';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Adapts a floor plan object to ensure it has all required properties
 * @param floorPlan Floor plan object to adapt
 * @returns Adapted floor plan with all required properties
 */
export function adaptFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || `fp-${Date.now()}`,
    name: floorPlan.name || 'New Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled',
    data: floorPlan.data || {},
    userId: floorPlan.userId || 'anonymous',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    canvasJson: floorPlan.canvasJson || null,
    canvasData: floorPlan.canvasData || null,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    metadata: {
      createdAt: floorPlan.metadata?.createdAt || now,
      updatedAt: floorPlan.metadata?.updatedAt || now,
      paperSize: floorPlan.metadata?.paperSize || PaperSize.A4,
      level: floorPlan.metadata?.level || 0,
      collaborators: floorPlan.metadata?.collaborators || [],
      version: floorPlan.metadata?.version || 1,
      lastModifiedBy: floorPlan.metadata?.lastModifiedBy,
      lastModifiedAt: floorPlan.metadata?.lastModifiedAt
    }
  };
}

/**
 * Convert application floor plans to core format
 */
export function appToCoreFloorPlans(floorPlans: Partial<FloorPlan>[]): FloorPlan[] {
  return floorPlans.map(adaptFloorPlan);
}

/**
 * Normalize drawing mode to ensure compatibility
 */
export function normalizeDrawingMode(mode: string | DrawingMode): DrawingMode {
  if (typeof mode === 'string') {
    // Check if the mode exists in the enum
    for (const key in DrawingMode) {
      if (DrawingMode[key as keyof typeof DrawingMode] === mode) {
        return mode as DrawingMode;
      }
    }
    // Default to select mode
    return DrawingMode.SELECT;
  }
  
  return mode;
}
