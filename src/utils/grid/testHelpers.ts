
import { Canvas } from 'fabric';
import { GridConfig } from '@/types/grid';
import { createPoint } from '@/types/core/Point';

/**
 * Create a test grid configuration
 * @returns Grid configuration for testing
 */
export const createTestGridConfig = (): GridConfig => {
  return {
    show: true,
    step: 20,
    color: '#cccccc',
    showSubgrid: true,
    subgridStep: 5,
    subgridColor: '#eeeeee'
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
