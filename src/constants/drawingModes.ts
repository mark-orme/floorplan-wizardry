
/**
 * Drawing mode enum
 * Defines available drawing modes for the canvas
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  SHAPE = 'shape',
  LINE = 'line',
  ERASER = 'eraser',
  TEXT = 'text',
  HAND = 'hand',
  STRAIGHT_LINE = 'straight_line',
  RECT = 'rect',
  CIRCLE = 'circle',
  WALL = 'wall',
  ERASE = 'erase',
  PENCIL = 'pencil',
  ROOM = 'room',
  RECTANGLE = 'rectangle',
  DOOR = 'door',
  WINDOW = 'window',
  PAN = 'pan',
  MEASURE = 'measure'
}

export const DEFAULT_DRAWING_MODE = DrawingMode.SELECT;

export const DRAWING_MODES = [
  { id: DrawingMode.SELECT, label: 'Select' },
  { id: DrawingMode.DRAW, label: 'Draw' },
  { id: DrawingMode.SHAPE, label: 'Shape' },
  { id: DrawingMode.LINE, label: 'Line' },
  { id: DrawingMode.ERASER, label: 'Eraser' },
  { id: DrawingMode.TEXT, label: 'Text' },
  { id: DrawingMode.HAND, label: 'Hand' }
];
