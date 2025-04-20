/**
 * Drawing modes for canvas operations
 * Centralized definition to avoid duplicate declarations
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  ERASE = 'erase',
  HAND = 'hand',
  WALL = 'wall',
  PENCIL = 'pencil',
  ROOM = 'room',
  TEXT = 'text',
  SHAPE = 'shape',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  DOOR = 'door',
  WINDOW = 'window',
  STRAIGHT_LINE = 'straight_line',
  PAN = 'pan',
  ERASER = 'eraser',
  MEASURE = 'measure',
  DIMENSION = 'dimension'
}

// Function to convert between string and enum
export function stringToDrawingMode(mode: string): DrawingMode {
  const normalizedMode = mode.toLowerCase();
  
  // Find matching enum value
  for (const key in DrawingMode) {
    if (DrawingMode[key as keyof typeof DrawingMode].toLowerCase() === normalizedMode) {
      return DrawingMode[key as keyof typeof DrawingMode];
    }
  }
  
  // Default to SELECT if not found
  console.warn(`Unknown drawing mode: ${mode}, using SELECT mode instead`);
  return DrawingMode.SELECT;
}

// Get drawing modes for tools menu
export function getToolDrawingModes(): DrawingMode[] {
  return [
    DrawingMode.SELECT,
    DrawingMode.DRAW,
    DrawingMode.LINE,
    DrawingMode.RECTANGLE,
    DrawingMode.CIRCLE,
    DrawingMode.WALL,
    DrawingMode.ROOM,
    DrawingMode.TEXT,
    DrawingMode.MEASURE,
    DrawingMode.HAND
  ];
}

// Get human-readable name for drawing mode
export function getDrawingModeName(mode: DrawingMode): string {
  switch (mode) {
    case DrawingMode.SELECT: return 'Select';
    case DrawingMode.DRAW: return 'Draw';
    case DrawingMode.ERASE: return 'Erase';
    case DrawingMode.HAND: return 'Pan';
    case DrawingMode.WALL: return 'Wall';
    case DrawingMode.PENCIL: return 'Pencil';
    case DrawingMode.ROOM: return 'Room';
    case DrawingMode.TEXT: return 'Text';
    case DrawingMode.SHAPE: return 'Shape';
    case DrawingMode.LINE: return 'Line';
    case DrawingMode.RECTANGLE: return 'Rectangle';
    case DrawingMode.CIRCLE: return 'Circle';
    case DrawingMode.DOOR: return 'Door';
    case DrawingMode.WINDOW: return 'Window';
    case DrawingMode.STRAIGHT_LINE: return 'Straight Line';
    case DrawingMode.PAN: return 'Pan';
    case DrawingMode.ERASER: return 'Eraser';
    case DrawingMode.MEASURE: return 'Measure';
    case DrawingMode.DIMENSION: return 'Dimension';
    default: return 'Unknown';
  }
}
