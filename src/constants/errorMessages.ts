
/**
 * Centralized error messages
 */

export const CANVAS_ERRORS = {
  INITIALIZATION: 'Failed to initialize canvas',
  NOT_READY: 'Canvas is not ready',
  INVALID_OPERATION: 'Invalid canvas operation',
  OBJECT_NOT_FOUND: 'Canvas object not found',
  UNSUPPORTED_BROWSER: 'Your browser does not support canvas operations'
};

export const DRAWING_ERRORS = {
  INVALID_TOOL: 'Invalid drawing tool',
  DRAWING_FAILED: 'Drawing operation failed',
  INVALID_COORDS: 'Invalid coordinates provided'
};

export const SYNC_ERRORS = {
  SYNC_FAILED: 'Failed to synchronize with server',
  NETWORK_ERROR: 'Network error occurred during sync',
  INVALID_DATA: 'Invalid data format received during sync'
};

export const AUTH_ERRORS = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired, please log in again',
  MISSING_PERMISSIONS: 'You do not have the required permissions'
};

export const FLOOR_PLAN_ERRORS = {
  LOAD_FAILED: 'Failed to load floor plan',
  SAVE_FAILED: 'Failed to save floor plan',
  INVALID_DATA: 'Invalid floor plan data',
  NOT_FOUND: 'Floor plan not found'
};
