
/**
 * Type definitions for mocks and test utilities
 * @module types/test/MockTypes
 */

import { Canvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

/**
 * Helper function to properly type a mock Canvas object
 * This ensures TypeScript recognizes mock canvas objects as Canvas types
 */
export function asMockCanvas<T>(mockCanvas: T): Canvas;

/**
 * Helper function to properly type a mock Fabric Object
 * This ensures TypeScript recognizes mock objects as FabricObject types
 */
export function asMockObject<T>(mockObject: T): FabricObject;

/**
 * Utility type for mocked functions
 */
export type MockFunction<T extends (...args: any[]) => any> = Mock<T>;

/**
 * Strongly typed mock canvas for testing
 */
export interface IMockCanvas extends Partial<Canvas> {
  on: MockFunction<(eventName: string, handler: Function) => any>;
  off: MockFunction<(eventName: string, handler?: Function) => any>;
  add: MockFunction<(objects: any) => any>;
  remove: MockFunction<(objects: any) => any>;
  getPointer: MockFunction<(event: any) => { x: number; y: number }>;
  requestRenderAll: MockFunction<() => void>;
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
}
