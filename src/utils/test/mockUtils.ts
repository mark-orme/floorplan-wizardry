
/**
 * Mock utilities for testing
 * Provides helper functions for creating properly typed mocks
 */
import { Canvas as FabricCanvas } from 'fabric';
import { asMockCanvas } from '@/types/test/MockTypes';

/**
 * Create a mock error logger for tests
 * @returns Mocked error logging functions
 */
export const createMockErrorLogger = () => ({
  captureError: jest.fn((error: unknown, context: string) => {
    console.error(`[Mock Error Captured] ${context}:`, error);
  }),
  captureMessage: jest.fn((message: string) => {
    console.log(`[Mock Message Captured]`, message);
  })
});

/**
 * Create a mock parameter for tests
 * Note: The returned object should only be used for parameter passing, 
 * not for spread operations as it might cause type errors.
 * 
 * @param params Parameters to include in the mock
 * @returns Typed mock object
 */
export const createMockParams = <T extends object>(params: T): T => {
  return params;
};

/**
 * Type guard for checking if an error is an Error instance
 * @param error Unknown error object
 * @returns Typed error
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Mocks a logger for testing
 */
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

/**
 * Type-safe mock for canvas event handlers
 * @param handlers Event handlers to mock
 */
export const createMockEventHandlers = <T extends Record<string, Function>>(handlers: T): T => {
  return handlers;
};

/**
 * Type-safe way to create a mock canvas with proper typing
 * This is preferred over direct casting with 'as'
 */
export const createSafeMockCanvas = () => {
  const mockCanvas = {
    on: jest.fn(),
    off: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    clear: jest.fn(),
    renderAll: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    getElement: jest.fn(),
    getContext: jest.fn(),
    dispose: jest.fn(),
    requestRenderAll: jest.fn(),
    loadFromJSON: jest.fn((json, callback) => {
      if (callback) callback();
    }),
    toJSON: jest.fn().mockReturnValue({}),
    getCenter: jest.fn().mockReturnValue({ top: 300, left: 400 }),
    setViewportTransform: jest.fn(),
    getActiveObject: jest.fn(),
    sendObjectToBack: jest.fn(),
    bringObjectToFront: jest.fn(),
    discardActiveObject: jest.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    getHandlers: jest.fn((eventName) => [() => {}]),
    triggerEvent: jest.fn((eventName, eventData) => {})
  };
  
  return asMockCanvas(mockCanvas as unknown as FabricCanvas);
};

/**
 * Utility to create a deep copy of fabric objects
 * @param obj Object to copy
 * @returns Deep copy of the object
 */
export const deepCopyFabricObject = <T>(obj: T): T => {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Create mock function parameters with the correct type
 * Used to fix the error in the tests
 * @param params The parameters for the mock function
 * @returns Typed parameters
 */
export const createMockFunctionParams = <T extends Record<string, any>>(params: T): T => {
  return params;
};

/**
 * Create a typed Point for use in tests
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A properly typed Point object
 */
export const createTestPoint = (x: number, y: number) => ({ x, y });
