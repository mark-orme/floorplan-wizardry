
import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';

// Re-export testing utilities
export { renderHook, act, render, fireEvent };

// Mock canvas factory
export const createMockCanvas = () => {
  const mockCanvas = {
    on: jest.fn(),
    off: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
    getActiveObjects: jest.fn().mockReturnValue([]),
    discardActiveObject: jest.fn(),
    contains: jest.fn().mockReturnValue(false),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    getPointer: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    getElement: jest.fn().mockReturnValue({}),
    loadFromJSON: jest.fn(),
    toJSON: jest.fn().mockReturnValue({}),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    item: jest.fn(),
    setZoom: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    sendToBack: jest.fn(),
    fire: jest.fn(),
    dispose: jest.fn()
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
