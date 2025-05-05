
/**
 * Fabric path types and constants
 */

export enum PATH_COMMANDS {
  MOVE_TO = 'M',
  LINE_TO = 'L',
  CURVE_TO = 'C',
  QUAD_TO = 'Q',
  ARC_TO = 'A',
  CLOSE = 'Z'
}

export const COMMAND_INDICES = {
  [PATH_COMMANDS.MOVE_TO]: { x: 1, y: 2 },
  [PATH_COMMANDS.LINE_TO]: { x: 1, y: 2 },
  [PATH_COMMANDS.CURVE_TO]: { x1: 1, y1: 2, x2: 3, y2: 4, x: 5, y: 6 },
  [PATH_COMMANDS.QUAD_TO]: { x1: 1, y1: 2, x: 3, y: 4 },
  [PATH_COMMANDS.ARC_TO]: { rx: 1, ry: 2, angle: 3, large: 4, sweep: 5, x: 6, y: 7 },
  [PATH_COMMANDS.CLOSE]: {}
};

export const PATH_CONSTANTS = {
  MIN_PATH_LENGTH: 2,
  MIN_COMMAND_LENGTH: 3,
  CLOSE_COMMAND_LENGTH: 1
};

export type PathCommand = string | number[];
