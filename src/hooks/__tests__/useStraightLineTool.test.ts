
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../straightLineTool/useStraightLineTool';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../straightLineTool/useStraightLineTool.d';
import { createMockCanvas } from '@/utils/test-helpers';
import { FixMe } from '@/types/typesMap';

describe('useStraightLineTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize properly', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isEnabled: true,
      canvas: mockCanvas as FixMe
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.snapEnabled).toBeDefined();
  });
  
  it('should handle mouse down event', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isEnabled: true,
      canvas: mockCanvas as FixMe
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions based on expected behavior
  });
  
  it('should handle mouse move event', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isEnabled: true,
      canvas: mockCanvas as FixMe
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions for measurementData
  });
  
  it('should handle mouse up event', () => {
    const mockCanvas = createMockCanvas();
    const saveCurrentState = vi.fn();
    
    const { result } = renderHook(() => useStraightLineTool({ 
      isEnabled: true,
      canvas: mockCanvas as FixMe,
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
