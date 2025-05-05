
import { vi } from 'vitest';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';

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
    dispose: vi.fn()
  };
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
