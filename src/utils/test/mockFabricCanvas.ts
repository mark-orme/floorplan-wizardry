
/**
 * Mock Fabric Canvas utilities for testing
 * @module utils/test/mockFabricCanvas
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';

/**
 * Create a mock Fabric canvas for testing
 * @returns Mocked Fabric canvas instance
 */
export const createMockCanvas = (): Canvas => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    clear: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    setViewportTransform: vi.fn(),
    width: 800,
    height: 600,
    _objects: []
  } as unknown as Canvas;
};

/**
 * Create a mock Fabric object for testing
 * @param type - Object type
 * @param props - Object properties
 * @returns Mocked Fabric object
 */
export const createMockObject = (type: string, props: Record<string, any> = {}): FabricObject => {
  return {
    type,
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop]),
    ...props
  } as unknown as FabricObject;
};

/**
 * Mock for canvas reference in React components
 * @returns React ref with mock canvas
 */
export const createMockCanvasRef = () => ({
  current: createMockCanvas()
});

/**
 * Mock for grid layer reference in React components
 * @returns React ref with mock grid objects
 */
export const createMockGridLayerRef = () => ({
  current: []
});
