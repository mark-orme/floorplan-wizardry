
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Normalizes a drawing mode value to ensure it's a valid DrawingMode
 * @param mode The drawing mode to normalize
 * @returns A valid DrawingMode enum value
 */
export const normalizeDrawingMode = (mode: string | DrawingMode): DrawingMode => {
  // If it's already a valid DrawingMode, return it
  if (Object.values(DrawingMode).includes(mode as DrawingMode)) {
    return mode as DrawingMode;
  }
  
  // Try to map from string representation
  const modeMap: Record<string, DrawingMode> = {
    'select': DrawingMode.SELECT,
    'draw': DrawingMode.DRAW,
    'line': DrawingMode.LINE,
    'straightLine': DrawingMode.STRAIGHT_LINE,
    'straight_line': DrawingMode.STRAIGHT_LINE,
    'rectangle': DrawingMode.RECTANGLE,
    'circle': DrawingMode.CIRCLE,
    'text': DrawingMode.TEXT,
    'pan': DrawingMode.PAN,
    'hand': DrawingMode.HAND,
    'zoom': DrawingMode.ZOOM,
    'erase': DrawingMode.ERASE,
    'eraser': DrawingMode.ERASER,
    'measure': DrawingMode.MEASURE,
    'wall': DrawingMode.WALL,
    'door': DrawingMode.DOOR,
    'window': DrawingMode.WINDOW,
    'room': DrawingMode.ROOM,
    'roomLabel': DrawingMode.ROOM_LABEL,
    'room_label': DrawingMode.ROOM_LABEL
  };
  
  return modeMap[mode.toLowerCase()] || DrawingMode.SELECT;
};

/**
 * Adapts a floor plan object to match the FloorPlan interface
 * Fills in missing properties with default values
 * @param floorPlan The floor plan object to adapt
 * @returns A valid FloorPlan object
 */
export const adaptFloorPlan = (floorPlan: Partial<CoreFloorPlan>): AppFloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || `floor-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || 'Untitled',
    index: floorPlan.index || 0,
    strokes: floorPlan.strokes?.map(stroke => ({
      ...stroke,
      type: 'line' as any,
      width: stroke.thickness
    })) || [],
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    metadata: floorPlan.metadata || {
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0
    },
    // Add the missing required properties
    data: floorPlan.data || {},
    userId: floorPlan.userId || 'anonymous'
  };
};

/**
 * Converts core floor plans to application floor plans
 * @param corePlans Core floor plan data
 * @returns Application-compatible floor plans
 */
export const coreToAppFloorPlans = (corePlans: CoreFloorPlan[]): AppFloorPlan[] => {
  return corePlans.map(plan => adaptFloorPlan(plan));
};

/**
 * Converts application floor plans to core floor plans
 * @param appPlans Application floor plan data
 * @returns Core-compatible floor plans
 */
export const appToCoreFloorPlans = (appPlans: AppFloorPlan[]): CoreFloorPlan[] => {
  return appPlans.map(plan => ({
    ...plan,
    label: plan.label || plan.name,
    data: plan.data || {},
    userId: plan.userId || 'anonymous'
  } as CoreFloorPlan));
};

/**
 * Creates an empty floor plan
 * @param index Index for the new floor plan
 * @returns An empty floor plan
 */
export const createEmptyFloorPlan = (index: number = 0): AppFloorPlan => {
  const now = new Date().toISOString();
  return adaptFloorPlan({
    name: `Floor ${index + 1}`,
    label: `Floor ${index + 1}`,
    index,
    level: index,
    createdAt: now,
    updatedAt: now,
  });
};
