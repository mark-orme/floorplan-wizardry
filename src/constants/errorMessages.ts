
/**
 * Standardized error messages for canvas operations
 * Provides consistent messaging for error handling
 */
export const ERROR_MESSAGES = {
  /** Error when canvas element is not found in DOM */
  CANVAS_ELEMENT_NOT_FOUND: 'Canvas element not found in the DOM',
  
  /** Error when canvas initialization fails */
  CANVAS_INIT_FAILED: 'Failed to initialize canvas',
  
  /** Error when loading saved canvas data */
  CANVAS_LOAD_FAILED: 'Failed to load canvas data',
  
  /** Error when saving canvas data */
  CANVAS_SAVE_FAILED: 'Failed to save canvas data',
  
  /** Error when adding an object to canvas */
  OBJECT_ADD_FAILED: 'Failed to add object to canvas',
  
  /** Error when removing an object from canvas */
  OBJECT_REMOVE_FAILED: 'Failed to remove object from canvas',
  
  /** Error when modifying an object */
  OBJECT_MODIFY_FAILED: 'Failed to modify object',
  
  /** Error when grid creation fails */
  GRID_CREATION_FAILED: 'Failed to create grid',
  
  /** Error when path conversion fails */
  PATH_CONVERSION_FAILED: 'Failed to convert path',
  
  /** Error when brush initialization fails */
  BRUSH_INIT_FAILED: 'Failed to initialize brush',
  
  /** Error when no canvas is available for an operation */
  NO_CANVAS_AVAILABLE: 'No canvas available for this operation',
  
  /** Error when an operation times out */
  OPERATION_TIMEOUT: 'Operation timed out',
  
  /** Error when canvas dimensions are invalid */
  INVALID_DIMENSIONS: 'Invalid canvas dimensions'
};
