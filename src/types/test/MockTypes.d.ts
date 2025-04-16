
/**
 * Type definitions for mocks and test utilities
 * @module types/test/MockTypes
 */

import { Canvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

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
  
  // Add methods for testing event handling
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
}

