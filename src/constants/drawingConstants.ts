
/**
 * Drawing-related constants
 */

// Drawing defaults
export const DEFAULT_LINE_COLOR = '#000000';
export const DEFAULT_FILL_COLOR = 'rgba(0, 0, 0, 0.1)';
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 16;
export const DEFAULT_FONT_FAMILY = 'Arial, sans-serif';

// Drawing limits
export const MIN_STROKE_WIDTH = 0.5;
export const MAX_STROKE_WIDTH = 20;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 72;
export const MAX_ZOOM = 10;
export const MIN_ZOOM = 0.1;

// Drawing modes (re-exported from drawingModes.ts)
// export { DrawingMode } from './drawingModes';

// Performance settings
export const CANVAS_RENDER_THROTTLE_MS = 16; // ~60fps
export const CANVAS_STATE_UPDATE_DEBOUNCE_MS = 300;
export const HISTORY_MAX_SIZE = 50;

// Canvas dimension defaults
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
