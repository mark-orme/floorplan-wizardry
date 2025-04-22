
/**
 * Grid related constants
 */

export const GRID_CONSTANTS = {
  // Small grid settings
  SMALL_GRID_SIZE: 10,
  SMALL_GRID_COLOR: '#e0e0e0',
  SMALL_GRID_WIDTH: 0.5,
  
  // Large grid settings
  LARGE_GRID_SIZE: 50,
  LARGE_GRID_COLOR: '#d0d0d0',
  LARGE_GRID_WIDTH: 1,
  
  // Default grid settings (for backward compatibility)
  GRID_SIZE: 50,
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: '#e0e0e0',
  DEFAULT_LINE_WIDTH: 1,
  DEFAULT_VISIBLE: true,
  
  // Grid visibility
  GRID_VISIBLE: true,
  SHOW_GRID: true,
  
  // Grid performance settings
  GRID_BATCH_SIZE: 50,
  GRID_LAYER_NAME: 'grid-layer',
  GRID_VIRTUALIZATION: true,
  
  // Grid behavior
  SNAP_TO_GRID: false,
  SNAP_THRESHOLD: 10,
  
  // Grid debug settings
  GRID_DEBUG: false,
  GRID_DEBUG_COLOR: '#ff0000',
  GRID_AUTO_FIX: true,
  
  // Grid render settings
  GRID_Z_INDEX: -1,
  GRID_SELECTABLE: false,
  GRID_EVENTED: false,
  
  // Grid performance
  GRID_RENDER_BUFFER: 100,
  GRID_RECREATION_DELAY: 500
};

// Re-export constants for backward compatibility
export const {
  SMALL_GRID_SIZE,
  SMALL_GRID_COLOR,
  LARGE_GRID_SIZE,
  LARGE_GRID_COLOR,
  GRID_SIZE,
  DEFAULT_GRID_SIZE,
  DEFAULT_GRID_COLOR,
  GRID_VISIBLE,
  SNAP_TO_GRID
} = GRID_CONSTANTS;
