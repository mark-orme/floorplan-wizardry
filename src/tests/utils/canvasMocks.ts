
import { vi } from 'vitest';

/**
 * Creates a mock setup for Fabric.js
 * @returns Mocked fabric module
 */
export function setupFabricMock() {
  const MockCanvas = vi.fn().mockImplementation(() => ({
    add: vi.fn<[any], any>(),
    remove: vi.fn<[any], any>(),
    getObjects: vi.fn<[], any[]>().mockReturnValue([]),
    renderAll: vi.fn<[], void>(),
    requestRenderAll: vi.fn<[], void>(),
    on: vi.fn<[string, Function], any>(),
    off: vi.fn<[string, Function?], any>(),
    getActiveObjects: vi.fn<[], any[]>().mockReturnValue([]),
    discardActiveObject: vi.fn<[], any>(),
    contains: vi.fn<[any], boolean>().mockReturnValue(false),
    withImplementation: vi.fn<[Function], Promise<void>>().mockImplementation(() => Promise.resolve())
  }));

  return {
    Canvas: MockCanvas,
    Line: vi.fn().mockImplementation(() => ({
      set: vi.fn<[any], any>(),
      setCoords: vi.fn<[], void>(),
      toObject: vi.fn<[], Record<string, any>>().mockReturnValue({})
    })),
    Rect: vi.fn().mockImplementation(() => ({
      set: vi.fn<[any], any>(),
      setCoords: vi.fn<[], void>(),
      toObject: vi.fn<[], Record<string, any>>().mockReturnValue({})
    })),
    Circle: vi.fn().mockImplementation(() => ({
      set: vi.fn<[any], any>(),
      setCoords: vi.fn<[], void>(),
      toObject: vi.fn<[], Record<string, any>>().mockReturnValue({})
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
        preventDefault: vi.fn<[], void>(),
        stopPropagation: vi.fn<[], void>()
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
