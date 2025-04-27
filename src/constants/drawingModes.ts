
/**
 * Drawing Modes
 * Enum of available drawing modes
 * @module constants/drawingModes
 */

export enum DrawingMode {
  SELECT = 'select',
  PENCIL = 'pencil',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  WALL = 'wall',
  ROOM = 'room',
  MEASURE = 'measure',
  DRAW = 'draw',
  ERASER = 'eraser',
  TEXT = 'text',
  STRAIGHT_LINE = 'straight_line',
  PAN = 'pan',
  HAND = 'hand'
}

export const DEFAULT_DRAWING_MODE = DrawingMode.SELECT;

export type DrawingModeType = DrawingMode | string;
