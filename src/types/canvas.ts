
/**
 * Canvas action types
 * @module types/canvas
 */

// Canvas action type definitions
export type CanvasActionType = 
  | 'DRAW'
  | 'ERASE'
  | 'CLEAR'
  | 'ADD_OBJECT'
  | 'REMOVE_OBJECT'
  | 'MOVE_OBJECT'
  | 'RESIZE_OBJECT'
  | 'MODIFY_OBJECT'
  | 'UNDO'
  | 'REDO'
  | 'ZOOM'
  | 'PAN'
  | 'SELECT'
  | 'DESELECT'
  | 'GROUP'
  | 'UNGROUP'
  | 'CHANGE_PROPERTY';

// Canvas action interface
export interface CanvasAction {
  type: CanvasActionType;
  payload?: any;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

// Canvas state snapshot
export interface CanvasStateSnapshot {
  id: string;
  state: any;
  timestamp: number;
  actionId?: string;
}

// Canvas operation result
export interface CanvasOperationResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: Error;
}
