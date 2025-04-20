
/**
 * Drawing modes enum used throughout the application.
 * This is the single source of truth for drawing modes.
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  WALL = 'wall',
  ROOM = 'room',
  DOOR = 'door',
  WINDOW = 'window',
  TEXT = 'text',
  DIMENSION = 'dimension',
  PAN = 'pan',
  HAND = 'hand',
  ZOOM = 'zoom',
  ERASER = 'eraser',
  RULER = 'ruler',
  ANNOTATION = 'annotation',
  FURNITURE = 'furniture'
}

/**
 * Convert a string to drawing mode safely
 * @param mode Mode string
 * @returns DrawingMode enum value or default (SELECT)
 */
export const toDrawingMode = (mode: string): DrawingMode => {
  // Check if the mode exists in the enum
  for (const key in DrawingMode) {
    if (DrawingMode[key as keyof typeof DrawingMode] === mode) {
      return mode as DrawingMode;
    }
  }
  // Default to select mode
  return DrawingMode.SELECT;
};

/**
 * Check if mode is valid
 * @param mode Mode to check
 * @returns boolean indicating if mode is valid
 */
export const isValidDrawingMode = (mode: string): boolean => {
  for (const key in DrawingMode) {
    if (DrawingMode[key as keyof typeof DrawingMode] === mode) {
      return true;
    }
  }
  return false;
};
