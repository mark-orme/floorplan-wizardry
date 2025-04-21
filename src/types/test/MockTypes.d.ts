
/**
 * Type definitions for mocks and test utilities
 * @module types/test/MockTypes
 */

import { Canvas, Object as FabricObject } from 'fabric';
import type { Mock } from 'vitest';

/**
 * Strongly typed mock canvas for testing with comprehensive properties
 */
export interface IMockCanvas extends Partial<Canvas> {
  on: Mock;
  off: Mock;
  add: Mock;
  remove: Mock;
  getPointer?: Mock;
  requestRenderAll: Mock;
  getObjects: Mock;
  
  // Add properties required by Fabric.js Canvas
  enablePointerEvents?: boolean;
  _willAddMouseDown?: boolean;
  _dropTarget?: any;
  _isClick?: boolean;
  _objects?: any[];
  withImplementation: Mock<[callback?: Function], Promise<void>>;
  
  // Add methods for testing event handling
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
}

/**
 * Strongly typed mock object for testing
 */
export interface IMockObject extends Partial<FabricObject> {
  set: Mock;
  setCoords: Mock;
  get: Mock;
}

/**
 * Helper function signature to properly type a mock canvas
 */
export function asMockCanvas(mockCanvas: any): Canvas & {
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
  withImplementation: Mock<[callback?: Function], Promise<void>>;
};

/**
 * Helper function signature to properly type a mock fabric object
 */
export function asMockObject(mockObject: any): FabricObject;
