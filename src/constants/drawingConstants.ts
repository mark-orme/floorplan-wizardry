
/**
 * Drawing constants for the application
 */

// Polyline styles
export const POLYLINE_STYLES = {
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
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter'
  },
  ROOM_BOUNDARY: {
    stroke: '#0066cc',
    strokeWidth: 2,
    fill: 'rgba(0, 102, 204, 0.1)',
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter'
  },
  MEASUREMENT: {
    stroke: '#ff6600',
    strokeWidth: 1,
    strokeDashArray: [3, 3],
    fill: 'transparent',
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter'
  }
};

// Line styles
export const LINE_STYLES = {
  DEFAULT: {
    stroke: '#000000',
    strokeWidth: 2
  },
  THIN: {
    stroke: '#333333',
    strokeWidth: 1
  },
  THICK: {
    stroke: '#000000',
    strokeWidth: 4
  },
  DASHED: {
    stroke: '#000000',
    strokeWidth: 2,
    strokeDashArray: [5, 5]
  },
  HIGHLIGHTED: {
    stroke: '#ff0000',
    strokeWidth: 3
  }
};

// Drawing modes
export const DRAWING_MODES = {
  SELECT: 'select',
  DRAW: 'draw',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TEXT: 'text',
  WALL: 'wall',
  ROOM: 'room'
};

// Cursor styles for different drawing modes
export const CURSOR_STYLES = {
  DEFAULT: 'default',
  CROSSHAIR: 'crosshair',
  GRAB: 'grab',
  GRABBING: 'grabbing',
  TEXT: 'text',
  NOT_ALLOWED: 'not-allowed'
};
