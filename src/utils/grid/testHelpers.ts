
import { Canvas } from 'fabric';
import { GridConfig } from '@/types/grid';
import { createPoint } from '@/types/core/Point';

/**
 * Create a test grid configuration
 * @returns Grid configuration for testing
 */
export const createTestGridConfig = (): GridConfig => {
  return {
    cellSize: 20,
    rows: 30,
    cols: 40,
    lineColor: '#cccccc',
    lineWidth: 1,
    majorLineInterval: 5,
    majorLineColor: '#aaaaaa',
    majorLineWidth: 2
  };
};

/**
 * Helper to create a mock canvas for grid testing
 * @param width Canvas width
 * @param height Canvas height
 * @returns Mock canvas
 */
export const createMockCanvasForGrid = (width = 800, height = 600): Canvas => {
  return {
    width,
    height,
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    setBackgroundColor: vi.fn(),
    clear: vi.fn(),
    dispose: vi.fn(),
    backgroundColor: '#ffffff',
    getCenter: vi.fn().mockReturnValue(createPoint(width / 2, height / 2))
  } as unknown as Canvas;
};
