
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Utility to adapt between different DrawingMode formats
 * Resolves build errors due to inconsistent DrawingMode imports
 */

// Map for different DrawingMode representations
const drawingModeMap = {
  'select': DrawingMode.SELECT,
  'draw': DrawingMode.DRAW,
  'straight-line': DrawingMode.STRAIGHT_LINE,
  'straight_line': DrawingMode.STRAIGHT_LINE,
  'wall': DrawingMode.WALL,
  'room': DrawingMode.ROOM,
  'eraser': DrawingMode.ERASER,
  'erase': DrawingMode.ERASE,
  'pan': DrawingMode.PAN,
  'measure': DrawingMode.MEASURE,
  'text': DrawingMode.TEXT,
  'shape': DrawingMode.SHAPE,
  'hand': DrawingMode.HAND,
  'pencil': DrawingMode.PENCIL,
  'line': DrawingMode.LINE,
  'rectangle': DrawingMode.RECTANGLE,
  'circle': DrawingMode.CIRCLE,
  'door': DrawingMode.DOOR,
  'window': DrawingMode.WINDOW,
};

/**
 * Convert any string value to a canonical DrawingMode
 * @param mode The input mode string
 * @returns A valid DrawingMode value
 */
export function normalizeDrawingMode(mode: string | DrawingMode): DrawingMode {
  const key = String(mode).toLowerCase();
  return drawingModeMap[key as keyof typeof drawingModeMap] || DrawingMode.SELECT;
}

/**
 * Check if a value is a valid DrawingMode
 * @param value The value to check
 * @returns True if the value is a valid DrawingMode
 */
export function isValidDrawingMode(value: unknown): value is DrawingMode {
  if (typeof value !== 'string') return false;
  return Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Get the display name for a drawing mode
 * @param mode The drawing mode
 * @returns User-friendly display name
 */
export function getDrawingModeDisplayName(mode: DrawingMode | string): string {
  const normalizedMode = normalizeDrawingMode(mode);
  switch (normalizedMode) {
    case DrawingMode.SELECT: return 'Select';
    case DrawingMode.DRAW: return 'Draw';
    case DrawingMode.STRAIGHT_LINE: return 'Straight Line';
    case DrawingMode.WALL: return 'Wall';
    case DrawingMode.ROOM: return 'Room';
    case DrawingMode.ERASER: return 'Eraser';
    case DrawingMode.PAN: return 'Pan';
    case DrawingMode.MEASURE: return 'Measure';
    case DrawingMode.TEXT: return 'Text';
    case DrawingMode.SHAPE: return 'Shape';
    case DrawingMode.LINE: return 'Line';
    case DrawingMode.RECTANGLE: return 'Rectangle';
    case DrawingMode.CIRCLE: return 'Circle';
    case DrawingMode.DOOR: return 'Door';
    case DrawingMode.WINDOW: return 'Window';
    case DrawingMode.PENCIL: return 'Pencil';
    case DrawingMode.HAND: return 'Hand';
    case DrawingMode.ERASE: return 'Erase';
    default: return String(mode);
  }
}
