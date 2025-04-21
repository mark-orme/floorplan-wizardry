
/**
 * Tests for useDrawingTool hook
 * @module hooks/__tests__/useDrawingTool
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingTool } from '@/hooks/useDrawingTool';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}));

describe('useDrawingTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with SELECT tool', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    expect(result.current.isDrawing).toBe(false);
  });

  it('should validate drawing tool correctly', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Valid tools
    expect(result.current.isValidDrawingTool(DrawingMode.SELECT)).toBe(true);
    expect(result.current.isValidDrawingTool(DrawingMode.DRAW)).toBe(true);
    expect(result.current.isValidDrawingTool(DrawingMode.STRAIGHT_LINE)).toBe(true);
    
    // Invalid tools
    expect(result.current.isValidDrawingTool('invalidTool')).toBe(false);
    expect(result.current.isValidDrawingTool(null)).toBe(false);
    expect(result.current.isValidDrawingTool(undefined)).toBe(false);
    expect(result.current.isValidDrawingTool(123)).toBe(false);
  });

  it('should set tool and show toast notification', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    act(() => {
      result.current.setTool(DrawingMode.DRAW);
    });
    
    expect(result.current.tool).toBe(DrawingMode.DRAW);
    expect(toast.success).toHaveBeenCalledWith(`Changed to ${DrawingMode.DRAW} tool`);
    expect(logger.info).toHaveBeenCalledWith("Tool changed", {
      previousTool: DrawingMode.SELECT,
      newTool: DrawingMode.DRAW
    });
  });

  it('should show error for invalid tool', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    act(() => {
      // @ts-expect-error - Testing with invalid tool
      result.current.setTool('invalidTool');
    });
    
    // Tool should remain unchanged
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    expect(toast.error).toHaveBeenCalledWith('Invalid drawing tool selected');
    expect(logger.error).toHaveBeenCalled();
  });

  it('should track drawing state', () => {
    const { result } = renderHook(() => useDrawingTool());
    const point = { x: 100, y: 100 };
    
    // Start drawing
    act(() => {
      result.current.startDrawing(point);
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // Continue drawing
    act(() => {
      result.current.continueDrawing({ x: 150, y: 150 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // End drawing
    act(() => {
      result.current.endDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(false);
  });

  it('should cancel drawing', () => {
    const { result } = renderHook(() => useDrawingTool());
    
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

  it('should not continue drawing if not started', () => {
    const { result } = renderHook(() => useDrawingTool());
    const point = { x: 100, y: 100 };
    
    // Try to continue without starting
    act(() => {
      result.current.continueDrawing(point);
    });
    
    expect(result.current.isDrawing).toBe(false);
  });

  it('should not end drawing if not started', () => {
    const { result } = renderHook(() => useDrawingTool());
    const point = { x: 100, y: 100 };
    
    // Try to end without starting
    act(() => {
      result.current.endDrawing(point);
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
});
