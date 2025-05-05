
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Unifies different DrawingMode types across the codebase
 * Resolves compatibility issues between similar but distinct drawing mode implementations
 */

// Standard drawing mode types mapping
const modeMap: Record<string, DrawingMode> = {
  'select': DrawingMode.SELECT,
  'draw': DrawingMode.DRAW,
  'line': DrawingMode.LINE,
  'straightline': DrawingMode.STRAIGHT_LINE,
  'straight_line': DrawingMode.STRAIGHT_LINE,
  'straight-line': DrawingMode.STRAIGHT_LINE,
  'wall': DrawingMode.WALL,
  'rectangle': DrawingMode.RECTANGLE,
  'circle': DrawingMode.CIRCLE,
  'text': DrawingMode.TEXT,
  'erase': DrawingMode.ERASE,
  'eraser': DrawingMode.ERASER,
  'measure': DrawingMode.MEASURE,
  'pan': DrawingMode.PAN,
  'hand': DrawingMode.HAND,
  'room': DrawingMode.ROOM,
  'door': DrawingMode.DOOR,
  'window': DrawingMode.WINDOW,
  'shape': DrawingMode.SHAPE,
  'pencil': DrawingMode.PENCIL,
};

/**
 * Normalize any drawing mode string to a canonical DrawingMode value
 * @param mode Drawing mode to normalize
 * @returns Normalized DrawingMode
 */
export function normalizeDrawingMode(mode: string | DrawingMode): DrawingMode {
  if (!mode) return DrawingMode.SELECT;
  
  const modeStr = String(mode).toLowerCase().replace(/-|_/g, '');
  return modeMap[modeStr] || DrawingMode.SELECT;
}

/**
 * Check if a value is a valid DrawingMode
 * @param mode The value to check
 * @returns True if it's a valid DrawingMode
 */
export function isValidDrawingMode(mode: any): mode is DrawingMode {
  return Object.values(DrawingMode).includes(mode as DrawingMode);
}

/**
 * Create a unified DrawingTool object from a drawing mode
 * @param mode Drawing mode value
 * @returns DrawingTool object with consistent properties
 */
export function createUnifiedDrawingTool(mode: string | DrawingMode) {
  const normalizedMode = normalizeDrawingMode(mode);
  
  return {
    id: normalizedMode,
    name: getDisplayName(normalizedMode),
    mode: normalizedMode,
  };
}

/**
 * Get a human-readable display name for a drawing mode
 * @param mode Drawing mode
 * @returns User-friendly display name
 */
export function getDisplayName(mode: string | DrawingMode): string {
  const normalizedMode = normalizeDrawingMode(mode as string);
  
  // Map mode to display name
  const displayNames: Record<DrawingMode, string> = {
    [DrawingMode.SELECT]: 'Select',
    [DrawingMode.DRAW]: 'Draw',
    [DrawingMode.STRAIGHT_LINE]: 'Straight Line',
    [DrawingMode.WALL]: 'Wall',
    [DrawingMode.ROOM]: 'Room',
    [DrawingMode.ERASER]: 'Eraser',
    [DrawingMode.PAN]: 'Pan',
    [DrawingMode.MEASURE]: 'Measure',
    [DrawingMode.TEXT]: 'Text',
    [DrawingMode.SHAPE]: 'Shape',
    [DrawingMode.LINE]: 'Line',
    [DrawingMode.RECTANGLE]: 'Rectangle',
    [DrawingMode.CIRCLE]: 'Circle',
    [DrawingMode.DOOR]: 'Door',
    [DrawingMode.WINDOW]: 'Window',
    [DrawingMode.PENCIL]: 'Pencil',
    [DrawingMode.HAND]: 'Hand',
    [DrawingMode.ERASE]: 'Erase',
  };
  
  return displayNames[normalizedMode] || String(mode);
}
