
/**
 * Utility for adapting floor plan formats between different parts of the application
 */
import { FloorPlan } from '@/types/floorPlanTypes';
import { DrawingMode } from '@/constants/drawingModes';

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

/**
 * Adapt a floor plan to ensure it has all required properties
 * @param floorPlan - Floor plan to adapt
 * @returns Adapted floor plan
 */
export const adaptFloorPlan = (floorPlan: any): FloorPlan => {
  return {
    id: floorPlan.id || `fp-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled',
    data: floorPlan.data || {},
    userId: floorPlan.userId || 'anonymous',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    canvasJson: floorPlan.canvasJson || null,
    canvasData: floorPlan.canvasData || null,
    createdAt: floorPlan.createdAt || new Date().toISOString(),
    updatedAt: floorPlan.updatedAt || new Date().toISOString(),
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    metadata: {
      createdAt: floorPlan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: floorPlan.metadata?.updatedAt || new Date().toISOString(),
      paperSize: floorPlan.metadata?.paperSize || 'A4',
      level: floorPlan.metadata?.level || 0
    }
  };
};

/**
 * Normalize drawing mode between different enum implementations
 * @param mode - Drawing mode to normalize
 * @returns Normalized drawing mode
 */
export const normalizeDrawingMode = (mode: any): DrawingMode => {
  if (typeof mode === 'string') {
    // Find matching mode in DrawingMode enum
    const modeKey = Object.keys(DrawingMode).find(
      key => DrawingMode[key as keyof typeof DrawingMode].toLowerCase() === mode.toLowerCase()
    );
    
    return modeKey 
      ? DrawingMode[modeKey as keyof typeof DrawingMode] 
      : DrawingMode.SELECT;
  }
  
  return mode || DrawingMode.SELECT;
};

/**
 * Merge DrawingMode enums to ensure compatibility
 * @param sourceMode - Source drawing mode
 * @returns Normalized drawing mode from constants
 */
export const mergeDrawingModes = (sourceMode: any): DrawingMode => {
  // Map from FloorPlan DrawingMode to constants DrawingMode
  const modeMapping: Record<string, DrawingMode> = {
    'select': DrawingMode.SELECT,
    'wall': DrawingMode.WALL,
    'room': DrawingMode.ROOM,
    'line': DrawingMode.LINE,
    'dimension': DrawingMode.MEASURE, // Map dimension to measure
    'text': DrawingMode.TEXT,
    'door': DrawingMode.DOOR,
    'window': DrawingMode.WINDOW,
    'stair': DrawingMode.WALL, // Map stair to wall as fallback
    'column': DrawingMode.RECTANGLE, // Map column to rectangle as fallback
    'eraser': DrawingMode.ERASER
  };
  
  if (typeof sourceMode === 'string' && sourceMode in modeMapping) {
    return modeMapping[sourceMode];
  }
  
  return DrawingMode.SELECT;
};
