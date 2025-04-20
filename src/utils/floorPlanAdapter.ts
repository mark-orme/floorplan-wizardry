
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan, Point, Stroke, Wall, Room } from '@/types/FloorPlan';

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
export const adaptFloorPlan = (floorPlan: Partial<FloorPlan>): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || `floor-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || 'Untitled',
    index: floorPlan.index || 0,
    strokes: floorPlan.strokes || [],
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
      author: 'System',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: floorPlan.data || {},
    userId: floorPlan.userId || 'anonymous'
  };
};

/**
 * Converts core floor plans to application floor plans
 * @param corePlans Core floor plan data
 * @returns Application-compatible floor plans
 */
export const appToCoreFloorPlans = (appPlans: FloorPlan[]): any[] => {
  return appPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    label: plan.label,
    index: plan.index,
    data: plan.data,
    userId: plan.userId,
    metadata: {
      ...plan.metadata,
      level: plan.level,
    }
  }));
};

/**
 * Creates an empty floor plan
 * @param index Index for the new floor plan
 * @returns An empty floor plan
 */
export const createEmptyFloorPlan = (index: number = 0): FloorPlan => {
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
