
/**
 * Drawing constants for line styles and behaviors
 * @module constants/drawingConstants
 */

/**
 * Polyline style constants
 */
export const POLYLINE_STYLES = {
  /** Default stroke color */
  DEFAULT_STROKE_COLOR: '#000000',
  
  /** Default stroke width */
  DEFAULT_STROKE_WIDTH: 2,
  
  /** Default fill color */
  DEFAULT_FILL: 'transparent',
  
  /** Default opacity */
  DEFAULT_OPACITY: 1,
  
  /** Wall stroke color */
  WALL_STROKE_COLOR: '#333333',
  
  /** Wall stroke width */
  WALL_STROKE_WIDTH: 4,
  
  /** Wall fill color */
  WALL_FILL: 'rgba(200, 200, 200, 0.3)',
  
  /** Wall opacity */
  WALL_OPACITY: 1,
  
  /** Room stroke color */
  ROOM_STROKE_COLOR: '#666666',
  
  /** Room stroke width */
  ROOM_STROKE_WIDTH: 2,
  
  /** Room fill color */
  ROOM_FILL: 'rgba(230, 230, 255, 0.3)',
  
  /** Room opacity */
  ROOM_OPACITY: 0.7,
  
  /** Default line cap style */
  DEFAULT_LINE_CAP: 'round',
  
  /** Default line join style */
  DEFAULT_LINE_JOIN: 'round'
};

/**
 * Line drawing constants
 */
export const LINE_CONSTANTS = {
  /** Minimum length for a valid line */
  MIN_LENGTH: 5,
  
  /** Snapping distance in pixels */
  SNAP_DISTANCE: 10,
  
  /** Minimum angle change for corner detection */
  CORNER_ANGLE_THRESHOLD: 20,
  
  /** Straightening threshold in degrees */
  STRAIGHTEN_THRESHOLD: 5
};

/**
 * Drawing mode enumeration
 */
export enum DrawingMode {
  /** Free-hand drawing mode */
  Freehand = "freehand",
  /** Straight line drawing mode */
  StraightLine = "straight-line",
  /** Wall drawing mode */
  Wall = "wall",
  /** Room drawing mode */
  Room = "room",
  /** Selection mode */
  Select = "select",
  /** Hand/pan mode */
  Hand = "hand",
  /** Measurement mode */
  Measure = "measure",
  /** Text mode */
  Text = "text",
  /** Eraser mode */
  Eraser = "eraser",
  /** No drawing mode */
  None = "none"
}
