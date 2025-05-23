
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../straightLineTool/useStraightLineTool';
import { Point } from '@/types/core/Point';
import { createCompleteMockCanvas } from '@/utils/test/createCompleteMockCanvas';

describe('useStraightLineTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize properly', () => {
    const mockCanvas = createCompleteMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      enabled: true,
      canvas: mockCanvas
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.snapEnabled).toBeDefined();
  });
  
  it('should handle mouse down event', () => {
    const mockCanvas = createCompleteMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      enabled: true,
      canvas: mockCanvas
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions based on expected behavior
  });
  
  it('should handle mouse move event', () => {
    const mockCanvas = createCompleteMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      enabled: true,
      canvas: mockCanvas
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions for measurementData
  });
  
  it('should handle mouse up event', () => {
    const mockCanvas = createCompleteMockCanvas();
    const saveCurrentState = vi.fn();
    
    const { result } = renderHook(() => useStraightLineTool({ 
      enabled: true,
      canvas: mockCanvas,
      saveCurrentState
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
      result.current.completeDrawing({ x: 30, y: 40 });
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(saveCurrentState).toHaveBeenCalled();
    // Check if line was finalized
  });
});
