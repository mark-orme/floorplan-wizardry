
/**
 * DrawingMode enum for tools
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TEXT = 'text',
  PAN = 'pan',
  ERASER = 'eraser',
  WALL = 'wall',
  ROOM = 'room',
  DOOR = 'door',
  WINDOW = 'window',
  STRAIGHT_LINE = 'straight_line',
  FREEHAND = 'freehand',
  POLYGON = 'polygon',
  MEASURE = 'measure',
  GRID = 'grid',
  ZOOM = 'zoom'
}

/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  PIXELS_PER_METER: 100
};
