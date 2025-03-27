
/**
 * Constants for drawing operations and styles
 * Used to maintain consistent drawing behaviors
 */
export const DRAWING_CONSTANTS = {
  /** Default drawing mode (freehand, line, shape) */
  DEFAULT_MODE: 'freehand',
  
  /** Default snap to grid distance threshold in pixels */
  SNAP_THRESHOLD: 10,
  
  /** Default selection transparency */
  SELECTION_OPACITY: 0.3,
  
  /** Default distance for point proximity checks */
  POINT_PROXIMITY: 5,
  
  /** Default angle for angle snapping (in degrees) */
  ANGLE_SNAP: 15,
  
  /** Default grid size in pixels */
  GRID_SIZE: 20,
  
  /** Maximum number of undo operations */
  MAX_UNDO_STEPS: 50
};

/**
 * Constants for polyline drawing styles
 * Used for walls, rooms, and other line-based objects
 */
export const POLYLINE_STYLES = {
  /** Default polyline stroke color */
  DEFAULT_STROKE_COLOR: '#333333',
  
  /** Default polyline stroke width */
  DEFAULT_STROKE_WIDTH: 2,
  
  /** Default polyline fill color */
  DEFAULT_FILL: 'transparent',
  
  /** Default polyline opacity */
  DEFAULT_OPACITY: 1.0,
  
  /** Default line cap style */
  DEFAULT_LINE_CAP: 'round',
  
  /** Default line join style */
  DEFAULT_LINE_JOIN: 'round',
  
  /** Wall-specific stroke color */
  WALL_STROKE_COLOR: '#000000',
  
  /** Wall-specific stroke width */
  WALL_STROKE_WIDTH: 6,
  
  /** Wall-specific fill color */
  WALL_FILL: 'transparent',
  
  /** Wall-specific opacity */
  WALL_OPACITY: 1.0,
  
  /** Room-specific stroke color */
  ROOM_STROKE_COLOR: '#666666',
  
  /** Room-specific stroke width */
  ROOM_STROKE_WIDTH: 1,
  
  /** Room-specific fill color */
  ROOM_FILL: 'rgba(200, 200, 200, 0.2)',
  
  /** Room-specific opacity */
  ROOM_OPACITY: 0.8
};
