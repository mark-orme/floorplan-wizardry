
/**
 * Tests for grid creation utilities
 * @module gridCreationUtils.test
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid, verifyGridExists, retryWithBackoff } from '../gridCreationUtils';
import { toast } from 'sonner';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "@/constants/numerics";

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('fabric', () => {
  const Line = vi.fn().mockImplementation((points, options) => ({
    type: 'line',
    points,
    ...options
  }));
  
  return {
    Line,
    Object: vi.fn()
  };
});

describe('Grid Creation Utilities', () => {
  let mockCanvas: any;
  let mockGridLayerRef: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock canvas
    mockCanvas = {
      width: DEFAULT_CANVAS_WIDTH,
      height: DEFAULT_CANVAS_HEIGHT,
      getWidth: vi.fn().mockReturnValue(DEFAULT_CANVAS_WIDTH),
      getHeight: vi.fn().mockReturnValue(DEFAULT_CANVAS_HEIGHT),
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      sendToBack: vi.fn(),
      requestRenderAll: vi.fn(),
      setWidth: vi.fn(),
      setHeight: vi.fn()
    };
    
    // Create mock grid layer ref
    mockGridLayerRef = {
      current: []
    };
  });
  
  test('createBasicEmergencyGrid creates grid with valid dimensions', () => {
    // When
    const result = createBasicEmergencyGrid(mockCanvas, mockGridLayerRef);
    
    // Then
    // Should create both small and large grid lines
    expect(result.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    expect(mockGridLayerRef.current).toBe(result);
  });
  
  test('createBasicEmergencyGrid handles null canvas', () => {
    // When
    const result = createBasicEmergencyGrid(null as unknown as Canvas, mockGridLayerRef);
    
    // Then
    expect(result).toEqual([]);
    expect(toast.error).toHaveBeenCalled();
  });
  
  test('createBasicEmergencyGrid handles invalid dimensions', () => {
    // Given - canvas with zero dimensions
    mockCanvas.width = 0;
    mockCanvas.height = 0;
    mockCanvas.getWidth.mockReturnValue(0);
    mockCanvas.getHeight.mockReturnValue(0);
    
    // When
    const result = createBasicEmergencyGrid(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(mockCanvas.setWidth).toHaveBeenCalledWith(DEFAULT_CANVAS_WIDTH);
    expect(mockCanvas.setHeight).toHaveBeenCalledWith(DEFAULT_CANVAS_HEIGHT);
  });
  
  test('verifyGridExists correctly reports grid status', () => {
    // Given - grid with objects
    mockGridLayerRef.current = [
      { id: 'obj1' },
      { id: 'obj2' }
    ];
    
    // When - all objects on canvas
    mockCanvas.contains.mockReturnValue(true);
    const result1 = verifyGridExists(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(result1).toBe(true);
    
    // When - no objects on canvas
    mockCanvas.contains.mockReturnValue(false);
    const result2 = verifyGridExists(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(result2).toBe(false);
  });
  
  test('retryWithBackoff schedules retry with increasing delay', () => {
    // Mock setTimeout
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = vi.fn() as any;
    
    // Given
    const mockFn = vi.fn();
    
    // When
    retryWithBackoff(mockFn, 0, 3);
    retryWithBackoff(mockFn, 1, 3);
    
    // Then
    expect(window.setTimeout).toHaveBeenCalledTimes(2);
    
    // Different delays for different attempts
    const call1Args = (window.setTimeout as any).mock.calls[0];
    const call2Args = (window.setTimeout as any).mock.calls[1];
    expect(call2Args[1]).toBeGreaterThan(call1Args[1]);
    
    // Restore original setTimeout
    window.setTimeout = originalSetTimeout;
  });
  
  test('retryWithBackoff respects max attempts', () => {
    // When - exceed max attempts
    const result = retryWithBackoff(() => {}, 3, 3);
    
    // Then
    expect(result).toBe(0); // Returns 0 when max attempts reached
  });
});
