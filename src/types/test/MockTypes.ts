
import { Canvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

/**
 * Type for mocked Canvas in tests
 * Only includes properties we actually use in tests
 */
export interface MockCanvas {
  on: Mock<[string, Function], unknown>;
  off: Mock<[string, Function?], unknown>;
  add: Mock<[FabricObject], unknown>;
  remove: Mock<[FabricObject], unknown>;
  requestRenderAll: Mock<[], unknown>;
  discardActiveObject: Mock<[], unknown>;
  getPointer: Mock<[any], { x: number; y: number }>;
  getObjects: Mock<[], FabricObject[]>;
  contains: Mock<[FabricObject], boolean>;
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
