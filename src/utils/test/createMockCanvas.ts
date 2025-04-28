
import { vi } from 'vitest';

/**
 * Create a mock canvas for testing
 * @returns Mock canvas object
 */
export const createMockCanvas = () => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    clear: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    sendToBack: vi.fn(),
    sendObjectToBack: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn()
  };
};

/**
 * Create a mock fabric object for testing
 * @param type Object type
 * @param props Additional properties
 * @returns Mock fabric object
 */
export const createMockObject = (type: string, props: Record<string, any> = {}) => {
  return {
    type,
    selectable: true,
    evented: true,
    set: vi.fn(),
    setCoords: vi.fn(),
    ...props
  };
};
