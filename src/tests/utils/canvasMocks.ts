
import { vi } from 'vitest';

/**
 * Creates a mock setup for Fabric.js
 * @returns Mocked fabric module
 */
export function setupFabricMock() {
  const MockCanvas = vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    // Fix the withImplementation method to correctly return Promise<void>
    withImplementation: vi.fn().mockImplementation((callback) => Promise.resolve())
  }));

  return {
    Canvas: MockCanvas,
    Line: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    })),
    Rect: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    })),
    Circle: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    }))
  };
}

/**
 * Creates a mock grid layer reference
 * @returns Mock grid layer reference
 */
export function createMockGridLayerRef() {
  return { 
    current: [
      { id: 'grid1', isGrid: true },
      { id: 'grid2', isGrid: true }
    ] 
  };
}

/**
 * Creates a mock history reference with optional past and future states
 * @param past Optional past states
 * @param future Optional future states
 * @returns Mock history reference
 */
export function createMockHistoryRef(past: any[][] = [], future: any[][] = []) {
  return {
    current: {
      past: [...past],
      future: [...future]
    }
  };
}

/**
 * Creates a mock canvas test utility
 * @returns Canvas test utilities
 */
export function createCanvasTestUtils() {
  return {
    getMouseEvent: (type: string, x: number, y: number) => {
      return {
        type,
        clientX: x,
        clientY: y,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };
    },
    triggerMouseEvent: (element: HTMLElement, type: string, x: number, y: number) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      element.dispatchEvent(event);
      return event;
    }
  };
}
