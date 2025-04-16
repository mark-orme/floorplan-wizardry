
import { Canvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

/**
 * Type for mocked Canvas in tests
 * Only includes properties we actually use in tests
 */
export interface MockCanvas {
  on: Mock<any, any>;
  off: Mock<any, any>;
  add: Mock<any, any>;
  remove: Mock<any, any>;
  requestRenderAll: Mock<any, any>;
  discardActiveObject: Mock<any, any>;
  getPointer: Mock<any, any>;
  getObjects: Mock<any, any>;
  contains: Mock<any, any>;
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  width: number;
  height: number;
  // Custom method for tests
  triggerEvent?: (eventName: string, eventData: any) => void;
  // Custom method for tests
  getHandlers?: (eventName: string) => Function[];
  [key: string]: any;
}

/**
 * Type assertion helper for tests
 */
export function asMockCanvas(mockCanvas: any): Canvas {
  return mockCanvas as unknown as Canvas;
}

/**
 * Type assertion helper for tests
 */
export function asMockObject(mockObject: any): FabricObject {
  return mockObject as unknown as FabricObject;
}
