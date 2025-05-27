
export const POLYLINE_STYLES = {
  DEFAULT: {
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'transparent',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    selectable: true,
  },
  BOUNDARY: {
    stroke: '#333333',
    strokeWidth: 1,
    fill: 'transparent',
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    selectable: true,
  },
  // Legacy property names for backward compatibility
  DEFAULT_STROKE_COLOR: '#000000',
  DEFAULT_STROKE_WIDTH: 2,
  DEFAULT_FILL: 'transparent',
  DEFAULT_OPACITY: 1,
  DEFAULT_LINE_CAP: 'round',
  DEFAULT_LINE_JOIN: 'round',
  
  WALL_STROKE_COLOR: '#2563eb',
  WALL_STROKE_WIDTH: 4,
  WALL_FILL: 'transparent',
  WALL_OPACITY: 1,
  
  ROOM_STROKE_COLOR: '#16a34a',
  ROOM_STROKE_WIDTH: 2,
  ROOM_FILL: 'rgba(34, 197, 94, 0.1)',
  ROOM_OPACITY: 0.8,
};
