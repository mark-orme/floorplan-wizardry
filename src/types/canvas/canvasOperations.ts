
/**
 * Canvas operations type definitions
 * @module types/canvas/canvasOperations
 */

export interface CanvasAction {
  type: string;
  timestamp: number;
  payload?: any;
}

export interface AddObjectAction extends CanvasAction {
  type: 'add_object';
  objectId: string;
}

export interface UpdateObjectAction extends CanvasAction {
  type: 'update_object';
  objectId: string;
  props: Record<string, any>;
}

export interface RemoveObjectAction extends CanvasAction {
  type: 'remove_object';
  objectId: string;
}

export interface MoveObjectAction extends CanvasAction {
  type: 'move_object';
  objectId: string;
  left: number;
  top: number;
}

export interface ResizeObjectAction extends CanvasAction {
  type: 'resize_object';
  objectId: string;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

export interface RotateObjectAction extends CanvasAction {
  type: 'rotate_object';
  objectId: string;
  angle: number;
}

export interface ModifyPathAction extends CanvasAction {
  type: 'modify_path';
  objectId: string;
  path: any[];
}

export interface AddFloorPlanAction extends CanvasAction {
  type: 'add_floor_plan';
  floorPlanId: string;
}

export interface UpdateFloorPlanAction extends CanvasAction {
  type: 'update_floor_plan';
  floorPlanId: string;
  data: Record<string, any>;
}

export interface DeleteFloorPlanAction extends CanvasAction {
  type: 'delete_floor_plan';
  floorPlanId: string;
}

// Helper function to create canvas actions with timestamp
export function createCanvasAction(action: Omit<CanvasAction, 'timestamp'>): CanvasAction {
  return {
    ...action,
    timestamp: Date.now()
  };
}
