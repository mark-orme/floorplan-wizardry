
/**
 * Type utilities for testing
 * Provides type-safe assertion functions for mocking objects
 * @module types/test/MockTypes
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Interface for a mock canvas in tests
 * Includes properties and methods commonly used in tests
 */
export interface IMockCanvas extends FabricCanvas {
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
}

/**
 * Type assertion function for creating a mock canvas
 * Provides type safety for canvas mocks
 * 
 * @param mockCanvas Canvas to type assert
 * @returns Typed mock canvas
 */
export function asMockCanvas(mockCanvas: any): IMockCanvas {
  return mockCanvas as IMockCanvas;
}

/**
 * Type assertion function for creating mock objects
 * Ensures type safety when creating mock objects
 * 
 * @param mockObject Object to type assert
 * @returns Typed mock object
 */
export function asMockObject<T>(mockObject: any): T {
  return mockObject as T;
}

/**
 * Type assertion function for creating mock hooks
 * Ensures type safety when mocking hooks
 * 
 * @param mockHook Hook to type assert
 * @returns Typed mock hook
 */
export function asMockHook<T>(mockHook: any): T {
  return mockHook as T;
}

/**
 * Type-safe way to create mock function parameters
 * Ensures proper typing for function parameters
 * 
 * @param params The parameters object
 * @returns Typed parameters object
 */
export function createMockParams<T extends Record<string, any>>(params: T): T {
  return params;
}
