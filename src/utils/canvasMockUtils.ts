
/**
 * Canvas mock utilities for testing
 * @module utils/canvasMockUtils
 */
import { vi } from 'vitest';

/**
 * Create a typed mock canvas for unit tests
 * @returns A mock canvas object
 */
export function createTypedMockCanvas() {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    getContext: vi.fn(),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    setBackgroundColor: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000',
      width: 1
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    selection: true,
    // Add helper methods for tests
    getHandlers: vi.fn().mockReturnValue([]),
    triggerEvent: vi.fn()
  };
}

/**
 * Create a typed mock history reference for unit tests
 * @returns A mock history reference object
 */
export function createTypedHistoryRef() {
  return {
    current: {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(true),
      push: vi.fn(),
      clear: vi.fn(),
      past: [],
      future: []
    }
  };
}

/**
 * Create a typed mock floor plan context for unit tests
 * @returns A mock floor plan context
 */
export function createTypedFloorPlanContext() {
  return {
    isDrawing: false,
    setIsDrawing: vi.fn(),
    tool: 'select',
    setTool: vi.fn(),
    lineColor: '#000000',
    setLineColor: vi.fn(),
    lineThickness: 2,
    setLineThickness: vi.fn(),
    canUndo: true,
    setCanUndo: vi.fn(),
    canRedo: true,
    setCanRedo: vi.fn(),
    showGrid: true,
    setShowGrid: vi.fn(),
    snapToGrid: false,
    setSnapToGrid: vi.fn(),
    zoom: 1,
    setZoom: vi.fn()
  };
}
