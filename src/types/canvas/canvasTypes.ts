
import { Object as FabricObject } from 'fabric';

/**
 * Canvas action types
 */
export type CanvasAction = 
  | { type: 'ADD_OBJECT'; object: FabricObject }
  | { type: 'REMOVE_OBJECT'; id: string }
  | { type: 'MODIFY_OBJECT'; id: string; props: Record<string, any> }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'ZOOM'; level: number; point?: { x: number; y: number } }
  | { type: 'PAN'; x: number; y: number }
  | { type: 'TOGGLE_GRID'; visible: boolean };
