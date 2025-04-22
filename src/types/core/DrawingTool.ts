
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Canonical DrawingTool type is now DrawingMode
 */
export type DrawingTool = DrawingMode;

// Shortcut map
export const DrawingToolShortcuts: Record<DrawingMode, string> = {
  [DrawingMode.SELECT]: 'V',
  [DrawingMode.DRAW]: 'D',
  [DrawingMode.LINE]: 'L',
  [DrawingMode.RECT]: 'R',
  [DrawingMode.CIRCLE]: 'C',
  [DrawingMode.WALL]: 'W',
  [DrawingMode.DOOR]: 'O',
  [DrawingMode.WINDOW]: 'I',
  [DrawingMode.ROOM]: 'M',
  [DrawingMode.MEASURE]: 'A',
  [DrawingMode.MEASUREMENT]: 'A',
  [DrawingMode.STRAIGHT_LINE]: 'S',
  [DrawingMode.HAND]: 'H',
  [DrawingMode.PAN]: 'P',
  [DrawingMode.ERASER]: 'E',
  [DrawingMode.ERASE]: 'E',
  [DrawingMode.TEXT]: 'T',
  [DrawingMode.ZOOM]: 'Z',
  [DrawingMode.PENCIL]: 'B',
  [DrawingMode.SHAPE]: 'Q',
  [DrawingMode.COLUMN]: 'N',
  [DrawingMode.DIMENSION]: 'X',
  [DrawingMode.STAIR]: 'Y',
  [DrawingMode.RECTANGLE]: 'R',
  [DrawingMode.ROOM_LABEL]: 'K'
};

/**
 * Valid DrawingTool check
 */
export function isValidDrawingTool(tool: any): tool is DrawingTool {
  return Object.values(DrawingMode).includes(tool as DrawingMode);
}
