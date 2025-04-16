
/**
 * Implementation of mock type utilities
 * @module types/test/MockTypes
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { IMockCanvas } from './MockTypes.d';

/**
 * Helper function to properly type a mock Canvas object
 * @param mockCanvas The mock canvas object to be typed as Canvas
 * @returns The same object typed as Canvas
 */
export function asMockCanvas<T>(mockCanvas: T): Canvas {
  return mockCanvas as unknown as Canvas;
}

/**
 * Helper function to properly type a mock Fabric Object
 * @param mockObject The mock object to be typed as FabricObject
 * @returns The same object typed as FabricObject
 */
export function asMockObject<T>(mockObject: T): FabricObject {
  return mockObject as unknown as FabricObject;
}

/**
 * Creates a strongly typed mock canvas for testing
 * @returns A mock canvas with proper typing
 */
export function createTypedMockCanvas(): IMockCanvas {
  // Implementation left to the actual test files
  return {} as IMockCanvas;
}
