
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
