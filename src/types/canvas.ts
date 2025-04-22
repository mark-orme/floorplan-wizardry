
/**
 * Canvas action types
 * @module types/canvas
 */

/**
 * Base canvas action interface
 */
export interface CanvasAction {
  type: string;
  timestamp: number;
  floorPlanId?: string;
  data?: Record<string, any>;
}

// Point interface for use in canvas operations
export interface Point {
  x: number;
  y: number;
}

// DrawOptions for canvas operations
export interface DrawOptions {
  color?: string;
  width?: number;
  opacity?: number;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'bevel' | 'round' | 'miter';
  options?: any;
}

// Canvas object representation
export interface CanvasObject {
  id: string;
  type: string;
  points?: Point[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
  properties?: Record<string, any>;
  options?: Record<string, any>;
}

// Stroke styling options
export interface StrokeStyle {
  color: string;
  width: number;
  opacity?: number;
}

// Add from Fabric point conversion helpers
export function fromFabricPoint(point: any): Point {
  return { x: point.x, y: point.y };
}

export function toFabricPoint(point: Point): any {
  return { x: point.x, y: point.y };
}

// ZoomOptions for canvas zoom operations
export interface ZoomOptions {
  scale: number;
  x?: number;
  y?: number;
  animate?: boolean;
}

/**
 * Add floor plan action
 */
export interface AddFloorPlanAction extends CanvasAction {
  type: 'add_floor_plan';
  floorPlanId: string;
}

/**
 * Update floor plan action
 */
export interface UpdateFloorPlanAction extends CanvasAction {
  type: 'update_floor_plan';
  floorPlanId: string;
  data: { index: number };
}

/**
 * Delete floor plan action
 */
export interface DeleteFloorPlanAction extends CanvasAction {
  type: 'delete_floor_plan';
  floorPlanId: string;
}

/**
 * Create a new canvas action with timestamp
 * @param action Partial canvas action
 * @returns Complete canvas action with timestamp
 */
export function createCanvasAction(action: Partial<CanvasAction> & { type: string }): CanvasAction {
  return {
    ...action,
    timestamp: action.timestamp || Date.now()
  };
}

// Re-export Point for compatibility
export { Point };

