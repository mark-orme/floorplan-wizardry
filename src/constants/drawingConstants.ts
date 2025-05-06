
/**
 * Constants for drawing operations
 */

// Core drawing styles
export const DRAWING_STYLES = {
  DEFAULT: {
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'transparent', 
    strokeLineCap: 'round',
    strokeLineJoin: 'round'
  },
  WALL: {
    stroke: '#333333',
    strokeWidth: 5,
    fill: 'transparent',
    strokeLineCap: 'round',
    strokeLineJoin: 'round'
  },
  ROOM_BOUNDARY: {
    stroke: '#666666',
    strokeWidth: 3,
    fill: 'rgba(200, 200, 200, 0.2)',
    strokeLineCap: 'round',
    strokeLineJoin: 'round'
  },
  MEASUREMENT: {
    stroke: '#0066cc',
    strokeWidth: 1,
    fill: 'transparent',
    strokeLineCap: 'butt',
    strokeLineJoin: 'round'
  }
};

// Add the POLYLINE_STYLES for hooks that need it
export const POLYLINE_STYLES = {
  DEFAULT: {
    stroke: '#0033cc',
    strokeWidth: 2,
    fill: 'transparent',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    selectable: true
  },
  BOUNDARY: {
    stroke: '#993366',
    strokeWidth: 3,
    fill: 'rgba(153, 51, 102, 0.1)',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    selectable: true
  }
};

// Default stroke properties
export const DEFAULT_STROKE_COLOR = '#000000';
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FILL = 'transparent';
export const DEFAULT_OPACITY = 1;
export const DEFAULT_LINE_CAP = 'round';
export const DEFAULT_LINE_JOIN = 'round';

// Wall specific properties
export const WALL_STROKE_COLOR = '#333333';
export const WALL_STROKE_WIDTH = 5;
export const WALL_FILL = 'transparent';

// Constants for drawing operations
export const DRAWING_CONSTANTS = {
  PIXELS_PER_METER: 100,
  GRID_SIZE: 20,
  SNAP_THRESHOLD: 10,
  MIN_POINT_DISTANCE: 5,
  MAX_ZOOM: 5,
  MIN_ZOOM: 0.5,
  DEFAULT_ZOOM: 1,
  DEFAULT_CANVAS_WIDTH: 1000,
  DEFAULT_CANVAS_HEIGHT: 800,
  ...DRAWING_STYLES
};

// Export individual constants for direct access as well
export {
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_FILL,
  DEFAULT_OPACITY,
  DEFAULT_LINE_CAP,
  DEFAULT_LINE_JOIN,
  WALL_STROKE_COLOR,
  WALL_STROKE_WIDTH,
  WALL_FILL
};

export default DRAWING_CONSTANTS;
