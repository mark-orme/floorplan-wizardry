
import { render, fireEvent, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { vi } from 'vitest';

// Re-export testing utilities
export { renderHook, act, render, fireEvent, screen };

// Mock canvas factory
export const createMockCanvas = () => {
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    getElement: vi.fn().mockReturnValue({}),
    loadFromJSON: vi.fn(),
    toJSON: vi.fn().mockReturnValue({}),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    item: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    sendToBack: vi.fn(),
    fire: vi.fn(),
    dispose: vi.fn(),
    initialize: vi.fn()
  };
  
  return mockCanvas;
};

// Enhanced testing utilities for querying
export const enhancedQueries = {
  getByTestId: (container: HTMLElement, testId: string) => {
    const element = container.querySelector(`[data-testid="${testId}"]`);
    if (!element) {
      throw new Error(`Unable to find element with testId: ${testId}`);
    }
    return element as HTMLElement;
  },
  queryByTestId: (container: HTMLElement, testId: string) => 
    container.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null,
  getAllByRole: (container: HTMLElement, role: string) =>
    Array.from(container.querySelectorAll(`[role="${role}"]`)) as HTMLElement[],
  queryAllByRole: (container: HTMLElement, role: string) =>
    Array.from(container.querySelectorAll(`[role="${role}"]`)) as HTMLElement[]
};

// Mock testing functions to satisfy test modules
export const mockJest = {
  fn: vi.fn,
  mock: vi.mock,
  mocked: vi.mocked
};

// Mock testing functions to satisfy test modules
export const testUtils = {
  renderHook,
  act
};
