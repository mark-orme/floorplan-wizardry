
import { FloorPlan, PaperSize } from '@/types/FloorPlan';
import { DrawingMode } from '@/constants/drawingModes';
import { CanvasObject } from '@/types/canvas';

/**
 * Convert a string to a DrawingMode
 * @param mode String representation of drawing mode
 * @returns Normalized DrawingMode enum value
 */
export const normalizeDrawingMode = (mode: string): DrawingMode => {
  // Convert string to uppercase and check against enum
  const normalizedMode = mode.toUpperCase().replace(/\s+/g, '_');
  
  // Check if it's a valid DrawingMode
  if (Object.values(DrawingMode).includes(normalizedMode as any)) {
    return normalizedMode as DrawingMode;
  }
  
  // Map common alternative names
  const modeMap: Record<string, DrawingMode> = {
    'SELECT_TOOL': DrawingMode.SELECT,
    'DRAW_TOOL': DrawingMode.DRAW,
    'LINE_TOOL': DrawingMode.LINE,
    'RECTANGLE_TOOL': DrawingMode.RECTANGLE,
    'CIRCLE_TOOL': DrawingMode.CIRCLE,
    'TEXT_TOOL': DrawingMode.TEXT,
    'WALL_TOOL': DrawingMode.WALL,
    'ERASER_TOOL': DrawingMode.ERASER,
    'PAN_TOOL': DrawingMode.PAN,
    'HAND_TOOL': DrawingMode.HAND,
  };
  
  return modeMap[normalizedMode] || DrawingMode.SELECT;
};

/**
 * Convert Canvas objects to floor plan strokes
 * @param objects Canvas objects
 * @returns Floor plan strokes array
 */
export const canvasObjectsToStrokes = (objects: CanvasObject[]) => {
  return objects
    .filter(obj => ['line', 'path', 'polyline'].includes(obj.type))
    .map(obj => ({
      id: obj.id,
      type: obj.type,
      points: obj.points || [],
      color: obj.properties?.color || '#000000',
      thickness: obj.properties?.width || 1,
      width: obj.properties?.width || 1,
    }));
};

/**
 * Convert Canvas objects to floor plan walls
 * @param objects Canvas objects
 * @returns Floor plan walls array
 */
export const canvasObjectsToWalls = (objects: CanvasObject[]) => {
  return objects
    .filter(obj => obj.type === 'wall')
    .map(obj => ({
      id: obj.id,
      points: obj.points || [],
      thickness: obj.properties?.thickness || 10,
      color: obj.properties?.color || '#333333',
      roomIds: obj.properties?.roomIds || [],
    }));
};

/**
 * Convert Canvas objects to floor plan rooms
 * @param objects Canvas objects
 * @returns Floor plan rooms array
 */
export const canvasObjectsToRooms = (objects: CanvasObject[]) => {
  return objects
    .filter(obj => obj.type === 'room')
    .map(obj => ({
      id: obj.id,
      name: obj.properties?.name || 'Untitled Room',
      type: obj.properties?.type || 'other',
      points: obj.points || [],
      color: obj.properties?.color || '#f0f0f0',
      area: obj.properties?.area || 0,
      level: obj.properties?.level || 0,
      walls: obj.properties?.walls || [],
    }));
};

/**
 * Create a FloorPlan object from Canvas objects
 * @param name Floor plan name
 * @param canvasObjects Canvas objects
 * @param canvasJson Serialized canvas JSON
 * @returns FloorPlan object
 */
export const createFloorPlanFromCanvas = (
  name: string,
  canvasObjects: CanvasObject[],
  canvasJson: string | null
): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: `fp-${Date.now()}`,
    name,
    label: name,
    data: {},
    userId: 'current-user', // This should be replaced with actual user ID
    walls: canvasObjectsToWalls(canvasObjects),
    rooms: canvasObjectsToRooms(canvasObjects),
    strokes: canvasObjectsToStrokes(canvasObjects),
    canvasJson,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0, // Gross Internal Area - should be calculated properly
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: 1
    }
  };
};
