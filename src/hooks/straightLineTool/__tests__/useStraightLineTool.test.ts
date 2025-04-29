
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../useStraightLineTool';
import { Point } from '@/types/core/Point';

// Mock fabric canvas
const mockCanvas = {
  add: vi.fn(),
  remove: vi.fn(),
  renderAll: vi.fn(),
} as any;

describe('useStraightLineTool', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({ canvas: mockCanvas })
    );
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('should handle drawing operations', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({ canvas: mockCanvas })
    );
    
    const startPoint: Point = { x: 100, y: 100 };
    
    // Start drawing
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // Continue drawing
    const movePoint: Point = { x: 200, y: 200 };
    act(() => {
      result.current.continueDrawing(movePoint);
    });
    
    // Complete drawing
    act(() => {
      result.current.completeDrawing(movePoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('should cancel drawing when requested', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({ canvas: mockCanvas })
    );
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // Cancel drawing
    act(() => {
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
});
