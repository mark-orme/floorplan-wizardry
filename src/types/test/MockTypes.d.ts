
/**
 * Type definitions for mocks and test utilities
 * @module types/test/MockTypes
 */

import { Canvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

/**
 * Type for mock functions to ensure type safety
 */
export type MockFunction<T extends (...args: any[]) => any> = Mock<T>;

/**
 * Strongly typed mock canvas for testing with comprehensive properties
 */
export interface IMockCanvas extends Partial<Canvas> {
  on: MockFunction<(eventName: string, handler: Function) => any>;
  off: MockFunction<(eventName: string, handler?: Function) => any>;
  add: MockFunction<(objects: any[]) => any>;
  remove: MockFunction<(objects: any[]) => any>;
  getPointer: MockFunction<(event: any) => { x: number; y: number }>;
  requestRenderAll: MockFunction<() => void>;
  
  // Add properties required by Fabric.js Canvas
  enablePointerEvents?: boolean;
  _willAddMouseDown?: boolean;
  _dropTarget?: any;
  _isClick?: boolean;
  _objects?: any[];
  _activeObject?: any;
  _groupSelector?: any;
  viewportTransform?: number[];
  defaultCursor?: string;
  hoverCursor?: string;
  moveCursor?: string;
  
  // Add methods for testing event handling
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
}

/**
 * Strongly typed mock object for testing
 */
export interface IMockObject extends Partial<FabricObject> {
  set: MockFunction<(options: any) => any>;
  setCoords: MockFunction<() => void>;
  get: MockFunction<(property: string) => any>;
}

/**
 * Helper function signature to properly type a mock canvas
 */
export function asMockCanvas(mockCanvas: any): Canvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
};

/**
 * Helper function signature to properly type a mock fabric object
 */
export function asMockObject(mockObject: any): FabricObject;
