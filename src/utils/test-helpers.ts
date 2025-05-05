
import { Canvas, Line } from 'fabric';
import { vi } from 'vitest';
import { FixMe } from '@/types/typesMap';

/**
 * Helper utility to create mock canvas for testing
 */
export function createMockCanvas() {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    wrapperEl: document.createElement('div'),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    // Add more required Canvas properties to satisfy TS
    item: vi.fn(),
    dispose: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    loadFromJSON: vi.fn(),
    toJSON: vi.fn(),
    clear: vi.fn(),
    setBackgroundColor: vi.fn(),
    setViewportTransform: vi.fn(),
    getActiveObject: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    defaultCursor: 'default',
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    isDrawingMode: false,
    selection: true,
    requestRenderAll: vi.fn(),
    forEachObject: vi.fn(),
    setCoords: vi.fn(),
    sendToBack: vi.fn(),
  } as FixMe<Canvas>;
}

/**
 * Helper utility to create mock line for testing
 */
export function createMockLine() {
  return {
    set: vi.fn(),
    get: vi.fn(),
    setCoords: vi.fn()
  } as FixMe<Line>;
}

/**
 * Helper utility for mocking hooks
 */
export function mockLineTools() {
  return {
    isDrawing: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    snapEnabled: true,
    anglesEnabled: false,
    measurementData: null,
    toggleGridSnapping: vi.fn(),
    toggleAngles: vi.fn(),
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    completeDrawing: vi.fn(),
    cancelDrawing: vi.fn(),
    handleMouseDown: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseUp: vi.fn(),
    isActive: true,
    renderTooltip: vi.fn().mockReturnValue(null)
  };
}

// Helper to create a fabric canvas ref
export function createMockCanvasRef() {
  return {
    current: createMockCanvas()
  };
}
