
/**
 * Canvas state hook types and utilities
 * @module hooks/useCanvasState
 */

/**
 * Drawing tool types
 */
export type DrawingTool = 
  | 'draw' 
  | 'eraser' 
  | 'wall' 
  | 'room' 
  | 'straightLine' 
  | 'text' 
  | 'measure' 
  | 'select'
  | 'hand';  // Added 'hand' as a valid drawing tool

/**
 * Canvas state interface
 */
export interface CanvasState {
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Current zoom level (1.0 = 100%) */
  zoomLevel: number;
  /** Whether grid snapping is enabled */
  snapToGrid: boolean;
  /** Current line thickness for drawing */
  lineThickness: number;
  /** Current line color for drawing (hex) */
  lineColor: string;
  /** Whether the canvas is in read-only mode */
  readonly: boolean;
}

/**
 * Default canvas state
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: 'select',
  zoomLevel: 1.0,
  snapToGrid: true,
  lineThickness: 2,
  lineColor: '#000000',
  readonly: false
};
