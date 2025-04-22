
import { Point } from '@/types/core/Point';

/**
 * Drawing options for canvas operations
 */
export interface DrawOptions {
  color?: string;
  thickness?: number;
  opacity?: number;
  dashed?: boolean;
  dashArray?: number[];
  fillColor?: string;
  fillOpacity?: number;
  selectable?: boolean;
  snapToGrid?: boolean;
  objectType?: string;
  metadata?: Record<string, any>;
}

/**
 * Canvas object interface
 */
export interface CanvasObject {
  id: string;
  type: string;
  points?: Point[];
  position?: Point;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: { x: number, y: number };
  style?: StrokeStyle;
  metadata?: Record<string, any>;
  selected?: boolean;
}

/**
 * Stroke style interface
 */
export interface StrokeStyle {
  color: string;
  thickness: number;
  opacity?: number;
  dashed?: boolean;
  dashArray?: number[];
  fillColor?: string;
  fillOpacity?: number;
}

/**
 * Canvas action interface
 */
export interface CanvasAction {
  type: string;
  payload?: any;
  timestamp: number;
}

/**
 * Add floor plan action
 */
export interface AddFloorPlanAction extends CanvasAction {
  type: 'ADD_FLOOR_PLAN';
  payload: {
    floorPlan: any;
  };
}

/**
 * Update floor plan action
 */
export interface UpdateFloorPlanAction extends CanvasAction {
  type: 'UPDATE_FLOOR_PLAN';
  payload: {
    id: string;
    changes: any;
  };
}

/**
 * Delete floor plan action
 */
export interface DeleteFloorPlanAction extends CanvasAction {
  type: 'DELETE_FLOOR_PLAN';
  payload: {
    id: string;
  };
}

/**
 * Create a canvas action
 */
export function createCanvasAction<T extends CanvasAction>(type: T['type'], payload?: any): T {
  return {
    type,
    payload,
    timestamp: Date.now()
  } as T;
}

/**
 * Re-export DrawOptions, CanvasObject, and StrokeStyle for use in other files
 */
export { DrawOptions, CanvasObject, StrokeStyle };
