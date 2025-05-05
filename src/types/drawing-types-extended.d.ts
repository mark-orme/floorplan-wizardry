
import { DrawingMode } from '@/constants/drawingModes';
import { GestureStateObject, GestureType, GestureState } from './drawing-types';
import { Point } from './core/Point';

/**
 * Extended GestureStateObject with additional properties needed by some components
 */
export interface ExtendedGestureStateObject extends GestureStateObject {
  // Add the missing properties needed by useMultiTouchGestures
  startPoints?: Point[];
}

/**
 * Create an extended gesture state object with all possible properties
 * @param type Gesture type
 * @param state Gesture state
 * @returns Complete gesture state object
 */
export function createExtendedGestureState(
  type: GestureType, 
  state: GestureState
): ExtendedGestureStateObject {
  return {
    type,
    state,
    scale: 1,
    rotation: 0,
    translation: { x: 0, y: 0 },
    startPoints: []
  };
}

/**
 * Extended DrawingMode type that includes all possible values
 * This helps with type compatibility across different modules
 */
export type ExtendedDrawingMode = DrawingMode | string;

/**
 * Convert any drawing mode value to a strongly typed DrawingMode
 * @param mode The input drawing mode
 * @returns DrawingMode value
 */
export function asDrawingMode(mode: ExtendedDrawingMode): DrawingMode {
  // Check if it's already a valid DrawingMode
  if (Object.values(DrawingMode).includes(mode as DrawingMode)) {
    return mode as DrawingMode;
  }
  
  // Handle string conversions
  const modeStr = String(mode).toUpperCase().replace(/-/g, '_');
  if (modeStr in DrawingMode) {
    return DrawingMode[modeStr as keyof typeof DrawingMode];
  }
  
  // Default to SELECT if not recognized
  return DrawingMode.SELECT;
}
