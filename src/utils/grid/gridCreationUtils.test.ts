
/**
 * Tests for grid creation utilities
 * @module utils/grid/gridCreationUtils.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Line } from 'fabric';
import { 
  createBasicEmergencyGrid, 
  createCompleteGrid,
  validateGrid,
  verifyGridExists,
  ensureGrid,
  retryWithBackoff,
  reorderGridObjects
} from './gridCreationUtils';

// Mock fabric
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      width: 800,
      height: 600,
      getWidth: () => 800,
      getHeight: () => 600,
      add: vi.fn(),
      sendToBack: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      remove: vi.fn(),
      requestRenderAll: vi.fn()
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      ...options,
      points,
      type: 'line'
    }))
  };
});

describe('Grid Creation Utils', () => {
  let canvas: Canvas;
  const gridLayerRef = { current: [] };
  
  beforeEach(() => {
    canvas = new Canvas();
    gridLayerRef.current = [];
    vi.clearAllMocks();
  });
  
  it('should create a basic emergency grid', () => {
    const gridObjects = createBasicEmergencyGrid(canvas);
    expect(Array.isArray(gridObjects)).toBe(true);
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(canvas.add).toHaveBeenCalled();
    expect(canvas.sendToBack).toHaveBeenCalled();
  });
  
  it('should create a complete grid', () => {
    const gridObjects = createCompleteGrid(canvas);
    expect(Array.isArray(gridObjects)).toBe(true);
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(canvas.add).toHaveBeenCalled();
    expect(canvas.sendToBack).toHaveBeenCalled();
  });
  
  it('should validate if grid exists', () => {
    const gridObjects = [new Line([0, 0, 100, 0], { objectType: 'grid' })];
    const result = validateGrid(canvas, gridObjects);
    expect(result).toBe(true);
  });
  
  it('should verify if grid exists', () => {
    const gridObjects = [new Line([0, 0, 100, 0], { objectType: 'grid' })];
    const result = verifyGridExists(canvas, gridObjects);
    expect(result).toBe(true);
  });
  
  it('should ensure grid exists', () => {
    const result = ensureGrid(canvas, gridLayerRef);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
  
  it('should reorder grid objects', () => {
    const gridObjects = [new Line([0, 0, 100, 0], { objectType: 'grid' })];
    reorderGridObjects(canvas, gridObjects);
    expect(canvas.sendToBack).toHaveBeenCalled();
  });
  
  it('should retry with backoff', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(mockFn, 3);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
