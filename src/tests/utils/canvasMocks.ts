
/**
 * Canvas and fabric test mocks
 * @module canvasMocks
 */
import { vi } from 'vitest';

/**
 * Creates a mock Fabric Canvas for testing
 * @returns {object} Mock Canvas object with testing methods
 */
export const createMockCanvas = () => ({
  on: vi.fn().mockReturnValue({}),
  off: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  getObjects: vi.fn().mockReturnValue([
    { type: 'polyline', id: 'drawing1' },
    { type: 'polyline', id: 'drawing2' },
    { type: 'line', id: 'grid1' },
    { type: 'line', id: 'grid2' }
  ]),
  contains: vi.fn().mockReturnValue(true),
  sendObjectToBack: vi.fn(),
  bringObjectToFront: vi.fn(),
  dispose: vi.fn(),
  clear: vi.fn(),
  requestRenderAll: vi.fn()
});

/**
 * Creates a mock Fabric Polyline for testing
 * @param {any[]} points - Polyline points
 * @param {object} options - Polyline options
 * @returns {object} Mock Polyline object
 */
export const createMockPolyline = (points: any[], options: any) => ({
  type: 'polyline',
  points,
  ...options,
  toObject: () => ({ type: 'polyline', points, ...options })
});

/**
 * Creates a mock Fabric Path for testing
 * @param {string} path - Path data
 * @param {object} options - Path options
 * @returns {object} Mock Path object
 */
export const createMockPath = (path: string, options: any) => ({
  type: 'path',
  path,
  ...options,
  toObject: () => ({ type: 'path', path, ...options })
});

/**
 * Sets up mock Fabric namespace for testing
 * @returns {object} Mock Fabric object with Canvas, Polyline, Path and util properties
 */
export const setupFabricMock = () => ({
  Canvas: vi.fn().mockImplementation(() => createMockCanvas()),
  Polyline: vi.fn().mockImplementation((points, options) => createMockPolyline(points, options)),
  Path: vi.fn().mockImplementation((path, options) => createMockPath(path, options)),
  util: {
    enlivenObjects: vi.fn().mockImplementation(([obj], options) => {
      return [options.reviver(obj)];
    })
  }
});

/**
 * Creates a mock grid layer reference for testing
 * @returns {object} Mock grid layer reference
 */
export const createMockGridLayerRef = () => ({ 
  current: [{ id: 'grid1' }, { id: 'grid2' }] 
});

/**
 * Creates a mock history reference for testing
 * @param {any[][]} past - Past states
 * @param {any[][]} future - Future states
 * @returns {object} Mock history reference
 */
export const createMockHistoryRef = (past: any[][] = [], future: any[][] = []) => ({
  current: { past, future }
});
