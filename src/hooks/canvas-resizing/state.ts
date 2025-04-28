
/**
 * Canvas resizing state
 */

/**
 * Interface for canvas resizing state
 */
export interface ResizingState {
  width: number;
  height: number;
  scale: number;
  aspectRatio: number;
  isResizing: boolean;
  initialResizeComplete: boolean;
  resizeInProgress: boolean;
  lastResizeTime: number;
}

/**
 * Default resizing state
 */
export const DEFAULT_RESIZING_STATE: ResizingState = {
  width: 800,
  height: 600,
  scale: 1,
  aspectRatio: 4 / 3,
  isResizing: false,
  initialResizeComplete: false,
  resizeInProgress: false,
  lastResizeTime: 0
};

/**
 * Function to reset resizing state
 * @param state Current resizing state
 * @returns Reset resizing state
 */
export function resetResizingState(state: ResizingState): ResizingState {
  return {
    ...state,
    isResizing: false,
    initialResizeComplete: true,
    resizeInProgress: false,
    lastResizeTime: Date.now()
  };
}

/**
 * Function to update resizing state
 * @param state Current resizing state
 * @param dimensions New dimensions
 * @returns Updated resizing state
 */
export function updateResizingState(
  state: ResizingState,
  dimensions: { width?: number; height?: number; scale?: number }
): ResizingState {
  const newWidth = dimensions.width ?? state.width;
  const newHeight = dimensions.height ?? state.height;
  
  return {
    ...state,
    width: newWidth,
    height: newHeight,
    scale: dimensions.scale ?? state.scale,
    aspectRatio: newWidth / newHeight,
    isResizing: true,
    resizeInProgress: true,
    lastResizeTime: Date.now()
  };
}
