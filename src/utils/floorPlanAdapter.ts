
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { FloorPlan as AppFloorPlan, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/typesBarrel';
import { v4 as uuidv4 } from 'uuid';

// Import converters
import { 
  adaptFloorPlan, 
  appToCoreFloorPlans, 
  appToCoreFloorPlan,
  coreToAppFloorPlans,
  coreToAppFloorPlan,
  validateStrokeType,
  validateRoomType,
  validatePoint,
  validateColor,
  validateTimestamp
} from './floorPlanAdapter/converters';

// Re-export converters
export { 
  adaptFloorPlan, 
  appToCoreFloorPlans, 
  appToCoreFloorPlan,
  coreToAppFloorPlans,
  coreToAppFloorPlan,
  validateStrokeType,
  validateRoomType,
  validatePoint,
  validateColor,
  validateTimestamp
};

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
 * Maps a room type string to a valid RoomTypeLiteral
 * @param type Room type to map
 * @returns Properly typed RoomTypeLiteral
 */
export const mapRoomType = (type: string): RoomTypeLiteral => {
  return validateRoomType(type);
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
    data: {}, // Required property
    userId: '' // Required property
  });
};
