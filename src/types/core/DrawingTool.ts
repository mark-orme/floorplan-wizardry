
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Drawing tool configuration interface
 */
export interface DrawingTool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  mode: DrawingMode;
  shortcut?: string;
  tooltip?: string;
  color?: string;
  active?: boolean;
}

/**
 * Drawing tool keyboard shortcuts
 */
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
