
import { vi } from 'vitest';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Creates a mock canvas for testing
 */
export function createMockCanvas() {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    wrapperEl: document.createElement('div'),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    item: vi.fn(),
    dispose: vi.fn(),
    // Add missing properties to make a more complete mock
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    isDrawingMode: false,
    sendToBack: vi.fn(),
    forEachObject: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    selection: true,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    viewportTransform: [1, 0, 0, 1, 0, 0]
  } as unknown as FabricCanvas;
}

/**
 * Creates a mock line for testing
 */
export function createMockLine() {
  return {
    set: vi.fn(),
    get: vi.fn(),
    setCoords: vi.fn()
  };
}

/**
 * Creates a mock line state for testing
 */
export function mockLineState() {
  return {
    isDrawing: false,
    startPoint: { x: 0, y: 0 } as Point,
    currentPoint: { x: 0, y: 0 } as Point,
    snapEnabled: true,
    anglesEnabled: true,
    measurementData: null as MeasurementData | null,
    toggleGridSnapping: vi.fn(),
    toggleAngles: vi.fn(),
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    completeDrawing: vi.fn(),
    cancelDrawing: vi.fn(),
    handleMouseDown: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseUp: vi.fn(),
    isActive: true
  };
}

/**
 * Create a typed canvas reference for tests
 * This ensures the ref matches the expected React.MutableRefObject<Canvas> type
 */
export function createCanvasRef() {
  return {
    current: createMockCanvas()
  } as React.MutableRefObject<FabricCanvas>;
}
