
/**
 * Constants for drawing modes
 * @module constants/drawingModes
 */

/**
 * Enum for drawing modes
 */
export enum DrawingMode {
  /** Free-form drawing */
  Free = 'free',
  /** Straight line drawing */
  Straight = 'straight',
  /** Polygon shape drawing */
  Polygon = 'polygon',
  /** Rectangle shape drawing */
  Rectangle = 'rectangle',
  /** Circle shape drawing */
  Circle = 'circle',
  /** Text addition */
  Text = 'text',
  /** Wall drawing */
  Wall = 'wall',
  /** Hand tool for panning */
  Hand = 'hand',
  /** Selection tool */
  Select = 'select',
  /** Eraser tool */
  Erase = 'erase',
  /** Measurement tool */
  Measure = 'measure'
}

/**
 * Drawing tool groups
 */
export const DRAWING_TOOL_GROUPS = {
  /** Shape drawing tools */
  SHAPES: [
    DrawingMode.Rectangle,
    DrawingMode.Circle,
    DrawingMode.Polygon
  ],
  
  /** Line drawing tools */
  LINES: [
    DrawingMode.Free,
    DrawingMode.Straight
  ],
  
  /** Construction tools */
  CONSTRUCTION: [
    DrawingMode.Wall,
    DrawingMode.Measure
  ],
  
  /** Selection tools */
  SELECTION: [
    DrawingMode.Select,
    DrawingMode.Hand
  ],
  
  /** Annotation tools */
  ANNOTATION: [
    DrawingMode.Text
  ],
  
  /** Editing tools */
  EDITING: [
    DrawingMode.Erase
  ]
};
