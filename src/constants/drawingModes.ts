
/**
 * Drawing modes constants
 * Defines all available drawing tools and modes
 */

export enum DrawingMode {
  // Selection and navigation tools
  SELECT = 'select',
  PAN = 'pan',
  ZOOM = 'zoom',
  
  // Drawing tools
  DRAW = 'draw',
  ERASER = 'eraser',
  STRAIGHT_LINE = 'straight-line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon',
  TEXT = 'text',
  
  // Specialized tools
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  STAIR = 'stair',
  ROOM = 'room',
  
  // Annotation tools
  MEASURE = 'measure',
  DIMENSION = 'dimension',
  ANGLE = 'angle',
  AREA = 'area',
  
  // Shape manipulation tools
  ROTATE = 'rotate',
  SCALE = 'scale',
  MOVE = 'move',
  
  // Utility tools
  EYEDROPPER = 'eyedropper',
  GRID = 'grid',
  SNAP = 'snap',
  
  // Default state
  NONE = 'none'
}

// Tool categories for organizing UI
export const ToolCategories = {
  NAVIGATION: 'navigation',
  DRAWING: 'drawing',
  SHAPES: 'shapes',
  ARCHITECTURE: 'architecture',
  ANNOTATION: 'annotation',
  UTILITIES: 'utilities'
};

// Map tools to categories
export const toolCategoryMap: Record<DrawingMode, string> = {
  [DrawingMode.SELECT]: ToolCategories.NAVIGATION,
  [DrawingMode.PAN]: ToolCategories.NAVIGATION,
  [DrawingMode.ZOOM]: ToolCategories.NAVIGATION,
  
  [DrawingMode.DRAW]: ToolCategories.DRAWING,
  [DrawingMode.ERASER]: ToolCategories.DRAWING,
  [DrawingMode.STRAIGHT_LINE]: ToolCategories.DRAWING,
  
  [DrawingMode.RECTANGLE]: ToolCategories.SHAPES,
  [DrawingMode.CIRCLE]: ToolCategories.SHAPES,
  [DrawingMode.ELLIPSE]: ToolCategories.SHAPES,
  [DrawingMode.POLYGON]: ToolCategories.SHAPES,
  [DrawingMode.TEXT]: ToolCategories.ANNOTATION,
  
  [DrawingMode.WALL]: ToolCategories.ARCHITECTURE,
  [DrawingMode.DOOR]: ToolCategories.ARCHITECTURE,
  [DrawingMode.WINDOW]: ToolCategories.ARCHITECTURE,
  [DrawingMode.STAIR]: ToolCategories.ARCHITECTURE,
  [DrawingMode.ROOM]: ToolCategories.ARCHITECTURE,
  
  [DrawingMode.MEASURE]: ToolCategories.ANNOTATION,
  [DrawingMode.DIMENSION]: ToolCategories.ANNOTATION,
  [DrawingMode.ANGLE]: ToolCategories.ANNOTATION,
  [DrawingMode.AREA]: ToolCategories.ANNOTATION,
  
  [DrawingMode.ROTATE]: ToolCategories.NAVIGATION,
  [DrawingMode.SCALE]: ToolCategories.NAVIGATION,
  [DrawingMode.MOVE]: ToolCategories.NAVIGATION,
  
  [DrawingMode.EYEDROPPER]: ToolCategories.UTILITIES,
  [DrawingMode.GRID]: ToolCategories.UTILITIES,
  [DrawingMode.SNAP]: ToolCategories.UTILITIES,
  
  [DrawingMode.NONE]: ToolCategories.NAVIGATION
};

// Default tool configurations
export const DefaultToolSettings = {
  [DrawingMode.DRAW]: {
    lineColor: '#000000',
    lineThickness: 2,
    lineDash: [],
    smoothing: true
  },
  [DrawingMode.STRAIGHT_LINE]: {
    lineColor: '#000000',
    lineThickness: 2,
    lineDash: [],
    snapToGrid: true,
    snapToAngle: true
  },
  [DrawingMode.RECTANGLE]: {
    lineColor: '#000000',
    fillColor: 'transparent',
    lineThickness: 2,
    lineDash: []
  }
};
