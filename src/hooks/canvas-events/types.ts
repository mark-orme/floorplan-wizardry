
import { Object as FabricObject } from 'fabric';

/**
 * Enhanced fabric object that supports direct property editing
 */
export interface EditableFabricObject extends FabricObject {
  // Ensuring this matches the FabricObject.set signature
  set(options: Record<string, any>): any;
  set(property: string, value: any): any;
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
}

/**
 * Canvas event handler type
 */
export type CanvasEventHandler = (e: any) => void;

/**
 * Canvas events map
 */
export interface CanvasEventHandlerMap {
  'mouse:down': CanvasEventHandler;
  'mouse:move': CanvasEventHandler;
  'mouse:up': CanvasEventHandler;
  'object:added': CanvasEventHandler;
  'object:removed': CanvasEventHandler;
  'object:modified': CanvasEventHandler;
  'object:rotating': CanvasEventHandler;
  'object:scaling': CanvasEventHandler;
  'object:moving': CanvasEventHandler;
  'selection:created': CanvasEventHandler;
  'selection:updated': CanvasEventHandler;
  'selection:cleared': CanvasEventHandler;
  [key: string]: CanvasEventHandler;
}
