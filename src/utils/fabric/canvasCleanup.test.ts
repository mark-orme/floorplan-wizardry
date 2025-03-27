
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { clearCanvas, disposeCanvas, removeObjectsFromCanvas, resetCanvasTransform } from './canvasCleanup';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

// Mock fabric.js
vi.mock('fabric', () => {
  const mockFabricObject = vi.fn();
  return {
    Canvas: vi.fn(),
    Object: mockFabricObject
  };
});

// Mock logger
vi.mock('@/utils/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('Canvas Cleanup Utilities', () => {
  let mockCanvas: any;
  let mockObjects: any[];
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock objects
    mockObjects = [
      { type: 'rect', id: 1 },
      { type: 'circle', id: 2 },
      { type: 'path', id: 3 }
    ];
    
    // Setup mock canvas
    mockCanvas = {
      getObjects: vi.fn().mockReturnValue(mockObjects),
      clear: vi.fn(),
      renderAll: vi.fn(),
      dispose: vi.fn(),
      remove: vi.fn(),
      setZoom: vi.fn(),
      viewportTransform: [1, 0, 0, 1, 0, 0]
    };
  });
  
  test('clearCanvas removes all objects and returns count', () => {
    // When
    const result = clearCanvas(mockCanvas);
    
    // Then
    expect(mockCanvas.getObjects).toHaveBeenCalled();
    expect(mockCanvas.clear).toHaveBeenCalled();
    expect(mockCanvas.renderAll).toHaveBeenCalled();
    expect(result).toBe(3); // Should return the count of removed objects
  });
  
  test('clearCanvas handles null canvas', () => {
    // When
    const result = clearCanvas(null);
    
    // Then
    expect(result).toBe(0);
  });
  
  test('disposeCanvas calls dispose on the canvas', () => {
    // When
    disposeCanvas(mockCanvas);
    
    // Then
    expect(mockCanvas.dispose).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Canvas disposed successfully');
  });
  
  test('disposeCanvas handles null canvas', () => {
    // When
    disposeCanvas(null);
    
    // Then - should not throw errors
    expect(mockCanvas.dispose).not.toHaveBeenCalled();
  });
  
  test('removeObjectsFromCanvas removes objects matching predicate', () => {
    // Given - predicate to remove circles
    const predicate = (obj: any) => obj.type === 'circle';
    
    // When
    const result = removeObjectsFromCanvas(mockCanvas, predicate);
    
    // Then
    expect(mockCanvas.getObjects).toHaveBeenCalled();
    expect(mockCanvas.remove).toHaveBeenCalledTimes(1);
    expect(mockCanvas.remove).toHaveBeenCalledWith(mockObjects[1]); // Should remove the circle
    expect(mockCanvas.renderAll).toHaveBeenCalled();
    expect(result).toBe(1); // Should return the count of removed objects
  });
  
  test('resetCanvasTransform resets zoom and transform', () => {
    // When
    resetCanvasTransform(mockCanvas);
    
    // Then
    expect(mockCanvas.setZoom).toHaveBeenCalledWith(1);
    expect(mockCanvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);
    expect(mockCanvas.renderAll).toHaveBeenCalled();
  });
  
  test('all functions handle errors gracefully', () => {
    // Given - canvas that throws errors
    const errorCanvas = {
      getObjects: vi.fn().mockImplementation(() => { throw new Error('Test error'); }),
      clear: vi.fn().mockImplementation(() => { throw new Error('Test error'); }),
      dispose: vi.fn().mockImplementation(() => { throw new Error('Test error'); }),
      setZoom: vi.fn().mockImplementation(() => { throw new Error('Test error'); })
    };
    
    // When - call all functions with the error-throwing canvas
    const clearResult = clearCanvas(errorCanvas as unknown as FabricCanvas);
    disposeCanvas(errorCanvas as unknown as FabricCanvas);
    const removeResult = removeObjectsFromCanvas(
      errorCanvas as unknown as FabricCanvas, 
      () => true
    );
    resetCanvasTransform(errorCanvas as unknown as FabricCanvas);
    
    // Then - should handle errors and log them
    expect(clearResult).toBe(0);
    expect(removeResult).toBe(0);
    expect(logger.error).toHaveBeenCalledTimes(4);
  });
});
