
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
    on: vi.fn<[string, Function], Canvas>(),
    off: vi.fn<[string, Function?], Canvas>(),
    add: vi.fn<FabricObject[], Canvas>(),
    remove: vi.fn<[FabricObject], Canvas>(),
    getObjects: vi.fn<[], FabricObject[]>().mockReturnValue([]),
    dispose: vi.fn<[], void>(),
    renderAll: vi.fn<[], void>(),
    requestRenderAll: vi.fn<[], void>(),
    getPointer: vi.fn<[any], { x: number; y: number }>().mockReturnValue({ x: 100, y: 100 }),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: "#000000",
      width: 2
    },
    getWidth: vi.fn<[], number>().mockReturnValue(800),
    getHeight: vi.fn<[], number>().mockReturnValue(600),
    selection: true,
    setActiveObject: vi.fn<[FabricObject], Canvas>(),
    discardActiveObject: vi.fn<[], Canvas>(),
    contains: vi.fn<[FabricObject], boolean>().mockReturnValue(false),
    clear: vi.fn<[], void>(),
    withImplementation: vi.fn<[Function], Promise<void>>().mockImplementation(() => Promise.resolve())
  } as unknown as Canvas;
};

// Create properly typed mock objects
const createMockObject = (props: Partial<MockFabricObject> = {}): FabricObject => {
  return {
    set: vi.fn<[any], FabricObject>(),
    setCoords: vi.fn<[], void>(),
    get: vi.fn<[string], any>((prop) => props[prop as keyof typeof props] || null),
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
