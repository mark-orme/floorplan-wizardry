
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool } from "@/types/floorPlanTypes";

/**
 * Convert DrawingMode to DrawingTool
 * @param mode DrawingMode value
 * @returns DrawingTool value
 */
export function asDrawingTool(mode: DrawingMode): DrawingTool {
  // Map DrawingMode to DrawingTool
  const modeToTool: Record<DrawingMode, DrawingTool> = {
    [DrawingMode.SELECT]: 'select',
    [DrawingMode.PAN]: 'pan',
    [DrawingMode.DRAW]: 'draw',
    [DrawingMode.ERASE]: 'erase',
    [DrawingMode.LINE]: 'line',
    [DrawingMode.RECTANGLE]: 'rectangle',
    [DrawingMode.CIRCLE]: 'circle',
    [DrawingMode.TEXT]: 'text',
    [DrawingMode.WALL]: 'wall',
    [DrawingMode.PENCIL]: 'draw', // Map to draw
    [DrawingMode.ROOM]: 'wall', // Map to wall
    [DrawingMode.ERASER]: 'erase', // Map to erase
    [DrawingMode.STRAIGHT_LINE]: 'line', // Map to line
    [DrawingMode.HAND]: 'pan', // Map to pan
    [DrawingMode.MEASURE]: 'wall', // Map to wall
    [DrawingMode.DOOR]: 'wall', // Map to wall
    [DrawingMode.WINDOW]: 'wall', // Map to wall
    [DrawingMode.SHAPE]: 'rectangle' // Map to rectangle
  };

  return modeToTool[mode] || 'select';
}

/**
 * Convert DrawingTool to DrawingMode
 * @param tool DrawingTool value
 * @returns DrawingMode value
 */
export function asDrawingMode(tool: DrawingTool): DrawingMode {
  // Map DrawingTool to DrawingMode
  const toolToMode: Record<string, DrawingMode> = {
    'select': DrawingMode.SELECT,
    'pan': DrawingMode.PAN,
    'draw': DrawingMode.DRAW,
    'erase': DrawingMode.ERASE,
    'line': DrawingMode.LINE,
    'rectangle': DrawingMode.RECTANGLE,
    'circle': DrawingMode.CIRCLE,
    'text': DrawingMode.TEXT,
    'wall': DrawingMode.WALL,
    'straight_line': DrawingMode.STRAIGHT_LINE
  };

  return toolToMode[tool] || DrawingMode.SELECT;
}
