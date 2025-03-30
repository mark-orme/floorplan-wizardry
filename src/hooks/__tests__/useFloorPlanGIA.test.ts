
/**
 * Tests for useFloorPlanGIA hook
 * Verifies Gross Internal Area calculation functionality
 * 
 * @module hooks/__tests__/useFloorPlanGIA
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanGIA } from '../useFloorPlanGIA';
import { Canvas } from 'fabric';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setTag: vi.fn()
}));

describe('useFloorPlanGIA Hook', () => {
  // Mock dependencies
  const mockCanvas = new Canvas(null);
  const mockCanvasRef = { current: mockCanvas };
  const mockSetGia = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with the correct interface', () => {
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: mockCanvasRef,
      setGia: mockSetGia
    }));
    
    // Check that the hook returns the expected function
    expect(typeof result.current.recalculateGIA).toBe('function');
  });
  
  it('should recalculate GIA based on canvas objects', () => {
    // Mock canvas objects that would be used in GIA calculation
    mockCanvas.getObjects = vi.fn().mockReturnValue([
      // Mock room objects with area property
      { objectType: 'room', area: 100 },
      { objectType: 'room', area: 150 }
    ]);
    
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: mockCanvasRef,
      setGia: mockSetGia
    }));
    
    // Call the recalculateGIA function
    act(() => {
      result.current.recalculateGIA();
    });
    
    // Should sum up the areas and call setGia with the result
    expect(mockSetGia).toHaveBeenCalledWith(250);
  });
  
  it('should handle missing canvas gracefully', () => {
    // Setup with null canvas reference
    const nullCanvasRef = { current: null };
    
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: nullCanvasRef,
      setGia: mockSetGia
    }));
    
    // Should not throw error when canvas is missing
    act(() => {
      result.current.recalculateGIA();
    });
    
    // Should not have called setGia
    expect(mockSetGia).not.toHaveBeenCalled();
    
    // Should capture the error to Sentry
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "Cannot calculate GIA: Canvas reference is null",
      "warning"
    );
  });
  
  it('should handle empty canvas gracefully', () => {
    // Mock empty canvas
    mockCanvas.getObjects = vi.fn().mockReturnValue([]);
    
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: mockCanvasRef,
      setGia: mockSetGia
    }));
    
    // Call the recalculateGIA function
    act(() => {
      result.current.recalculateGIA();
    });
    
    // Should call setGia with 0 for empty canvas
    expect(mockSetGia).toHaveBeenCalledWith(0);
  });
  
  it('should handle objects without area property', () => {
    // Mock canvas with objects lacking area property
    mockCanvas.getObjects = vi.fn().mockReturnValue([
      { objectType: 'room' }, // No area property
      { objectType: 'room', area: 100 },
      { objectType: 'wall' } // Not a room
    ]);
    
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: mockCanvasRef,
      setGia: mockSetGia
    }));
    
    // Call the recalculateGIA function
    act(() => {
      result.current.recalculateGIA();
    });
    
    // Should only count valid areas
    expect(mockSetGia).toHaveBeenCalledWith(100);
  });
  
  it('should capture errors during calculation', () => {
    // Mock canvas that will throw an error
    mockCanvas.getObjects = vi.fn().mockImplementation(() => {
      throw new Error('Canvas error');
    });
    
    const { result } = renderHook(() => useFloorPlanGIA({
      fabricCanvasRef: mockCanvasRef,
      setGia: mockSetGia
    }));
    
    // Should catch error and report to Sentry
    act(() => {
      result.current.recalculateGIA();
    });
    
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(mockSetGia).not.toHaveBeenCalled();
  });
});
