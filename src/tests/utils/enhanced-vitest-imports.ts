
/**
 * Enhanced centralized import file for Vitest utilities
 * Include this file at the top of test files for better type safety
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Canvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Type augmentations for better mock typings
type MockFabricObject = {
  set: ReturnType<typeof vi.fn>;
  setCoords: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  type?: string;
  objectType?: string;
  id?: string;
};

// Create properly typed mocks
const createCanvasMock = (): Canvas => {
  return {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    dispose: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: "#000000",
      width: 2
    },
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    selection: true,
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    clear: vi.fn(),
    // Fix: Ensure withImplementation returns Promise<void>
    withImplementation: vi.fn().mockImplementation((callback) => {
      // Properly implement to always return Promise<void>
      return Promise.resolve();
    })
  } as unknown as Canvas;
};

// Create properly typed mock objects
const createMockObject = (props: Partial<MockFabricObject> = {}): FabricObject => {
  return {
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop as keyof typeof props] || null),
    ...props
  } as unknown as FabricObject;
};

// Export everything
export {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  renderHook,
  act,
  render,
  screen,
  fireEvent,
  waitFor,
  createCanvasMock,
  createMockObject,
  DrawingMode
};
