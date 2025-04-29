
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../straightLineTool/useStraightLineTool';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../straightLineTool/useStraightLineTool.d';

// Create mock canvas
const createMockCanvas = () => ({
  add: vi.fn(),
  remove: vi.fn(),
  renderAll: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
  wrapperEl: document.createElement('div')
});

describe('useStraightLineTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize properly', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isActive: true,
      canvas: mockCanvas as any
    }));
    
    expect(result.current.isActive).toBe(true);
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.snapEnabled).toBeDefined();
  });
  
  it('should handle mouse down event', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isActive: true,
      canvas: mockCanvas as any
    }));
    
    act(() => {
      result.current.handleMouseDown({ x: 10, y: 20 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions based on expected behavior
  });
  
  it('should handle mouse move event', () => {
    const mockCanvas = createMockCanvas();
    const { result } = renderHook(() => useStraightLineTool({ 
      isActive: true,
      canvas: mockCanvas as any
    }));
    
    act(() => {
      result.current.handleMouseDown({ x: 10, y: 20 });
      result.current.handleMouseMove({ x: 30, y: 40 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    // Additional assertions for measurementData
  });
  
  it('should handle mouse up event', () => {
    const mockCanvas = createMockCanvas();
    const saveCurrentState = vi.fn();
    
    const { result } = renderHook(() => useStraightLineTool({ 
      isActive: true,
      canvas: mockCanvas as any,
      saveCurrentState
    }));
    
    act(() => {
      result.current.handleMouseDown({ x: 10, y: 20 });
      result.current.handleMouseMove({ x: 30, y: 40 });
      result.current.handleMouseUp();
    });
    
    expect(result.current.isDrawing).toBe(false);
    // Check if line was finalized
  });
});
