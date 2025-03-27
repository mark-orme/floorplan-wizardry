
/**
 * Constants for brush settings
 * @module constants/brushConstants
 */

/**
 * Brush constants
 */
export const BRUSH_CONSTANTS = {
  /** Default pencil width */
  DEFAULT_PENCIL_WIDTH: 2,
  
  /** Default pencil color */
  DEFAULT_PENCIL_COLOR: '#000000',
  
  /** Minimum brush width */
  MIN_BRUSH_WIDTH: 0.5,
  
  /** Maximum brush width */
  MAX_BRUSH_WIDTH: 50,
  
  /** Default pressure sensitivity */
  DEFAULT_PRESSURE: false,
  
  /** Default brush opacity */
  DEFAULT_OPACITY: 1.0
};

/**
 * Line style constants
 */
export const LINE_STYLES = {
  /** Solid line */
  SOLID: [],
  
  /** Dashed line */
  DASHED: [5, 5],
  
  /** Dotted line */
  DOTTED: [2, 2],
  
  /** Dash dot line */
  DASH_DOT: [10, 5, 2, 5]
};

/**
 * Brush types
 */
export type BrushType = 'pencil' | 'marker' | 'highlighter' | 'pen' | 'eraser';
