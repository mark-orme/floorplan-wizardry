
/**
 * Mock utilities for testing
 * Provides helper functions for creating mock objects and parameters
 */
import { vi } from 'vitest';
import { Point } from '@/types/floor-plan/typesBarrel';
import { ICanvasMock, createMinimalCanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Creates type-safe mock parameters
 * @param params Parameters object
 * @returns The same parameters with proper typing
 */
export function createMockParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Creates a test point with x and y coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Safely type cast mock objects
 * @param mock Object to cast
 * @returns Typed mock object
 */
export function asMock<T>(mock: any): T {
  return mock as T;
}

/**
 * Creates a canvas mock with proper typing
 * @returns Canvas mock
 */
export function createCanvasMock(): ICanvasMock {
  return createMinimalCanvasMock();
}

/**
 * Safely cast a canvas mock to ICanvasMock type
 * @param mock Canvas mock to cast
 * @returns Typed canvas mock
 */
export function asCanvasMock(mock: any): ICanvasMock {
  return mock as ICanvasMock;
}

/**
 * Create a strongly typed mock function
 * @returns Mock function with proper typing
 */
export function createMockFunction<TArgs extends any[], TReturn>(): jest.Mock<TReturn, TArgs> {
  return vi.fn<TArgs, TReturn>();
}

/**
 * Creates a mock implementation that returns a Promise
 * @param value Value to resolve with
 * @returns Mock implementation function
 */
export function createMockAsyncImplementation<T>(value: T): () => Promise<T> {
  return vi.fn().mockResolvedValue(value);
}
