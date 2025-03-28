
/**
 * Canvas constants for consistent configuration
 * @module constants/canvasConstants
 */

/**
 * Canvas constants
 * @constant {Object}
 */
export const CANVAS_CONSTANTS = {
  /** Default canvas width */
  DEFAULT_WIDTH: 800,
  
  /** Default canvas height */
  DEFAULT_HEIGHT: 600,
  
  /** Default canvas background color */
  DEFAULT_BACKGROUND_COLOR: '#ffffff',
  
  /** Default brush color */
  DEFAULT_BRUSH_COLOR: '#000000',
  
  /** Default brush width */
  DEFAULT_BRUSH_WIDTH: 2,
  
  /** Default zoom increment */
  ZOOM_INCREMENT: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 5,
  
  /** Minimum zoom level */
  MIN_ZOOM: 0.5
};

/**
 * Error messages for canvas operations
 * @constant {Object}
 */
export const ERROR_MESSAGES = {
  /** Canvas element not found error */
  CANVAS_ELEMENT_NOT_FOUND: 'Canvas element not found in DOM',
  
  /** Canvas initialization failed error */
  CANVAS_INIT_FAILED: 'Failed to initialize canvas',
  
  /** Grid creation failed error */
  GRID_CREATION_FAILED: 'Failed to create grid',
  
  /** Tool initialization failed error */
  TOOL_INIT_FAILED: 'Failed to initialize drawing tools'
};
