/**
 * Mock Fabric.js canvas utilities for testing
 * @module utils/test/mockFabricCanvas
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';
import { FabricEventNames } from '@/types/fabric-events';

/**
 * Create a mock Fabric object for testing
 * @param type Object type (e.g., 'rect', 'line', 'circle')
 * @param props Additional properties for the mock object
 * @returns Mocked Fabric object
 */
export function createMockObject(type: string, props: Record<string, any> = {}): FabricObject {
  return {
    type,
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop] || null),
    ...props
  } as unknown as FabricObject;
}

/**
 * Create a mock canvas for testing
 * @returns Mocked canvas with common methods
 */
export function createMockCanvas() {
  return {
    on: vi.fn().mockReturnThis(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    selection: true,
    contains: vi.fn().mockReturnValue(false),
    getActiveObjects: vi.fn().mockReturnValue([]),
    getCenter: vi.fn().mockReturnValue({ x: 400, y: 300 }),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    zoomToPoint: vi.fn(),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    isDrawingMode: false,
    freeDrawingBrush: {
      width: 1,
      color: '#000000'
    }
  } as unknown as FabricCanvas;
}

/**
 * Create mock grid layer reference
 * @returns Mock grid layer reference
 */
export const createMockGridLayerRef = () => ({ current: [] });

/**
 * Create mock history reference
 * @param pastStates Past states for history
 * @param futureStates Future states for history
 * @returns Mock history reference
 */
export const createMockHistoryRef = (
  pastStates = [],
  futureStates = []
) => ({
  current: {
    past: pastStates,
    future: futureStates
  }
});
