/**
 * Tool transition states test
 * Verifies proper state transitions between different drawing modes
 * @module tests/tools/toolTransitionStates
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingTool } from '@/hooks/useDrawingTool';
import { renderHook, act } from '@testing-library/react-hooks';
import { toast } from 'sonner';

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

describe('Tool Transition States Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('initializes with SELECT tool', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('transitions between valid tools correctly', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Transition to DRAW
    act(() => {
      result.current.setTool(DrawingMode.DRAW);
    });
    
    expect(result.current.tool).toBe(DrawingMode.DRAW);
    expect(toast.success).toHaveBeenCalledWith(`Changed to ${DrawingMode.DRAW} tool`);
    
    // Transition to STRAIGHT_LINE
    act(() => {
      result.current.setTool(DrawingMode.STRAIGHT_LINE);
    });
    
    expect(result.current.tool).toBe(DrawingMode.STRAIGHT_LINE);
    expect(toast.success).toHaveBeenCalledWith(`Changed to ${DrawingMode.STRAIGHT_LINE} tool`);
    
    // Transition to SELECT
    act(() => {
      result.current.setTool(DrawingMode.SELECT);
    });
    
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    expect(toast.success).toHaveBeenCalledWith(`Changed to ${DrawingMode.SELECT} tool`);
  });
  
  it('refuses to transition to invalid tools', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Initial tool
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    
    // Try to transition to invalid tool
    act(() => {
      // @ts-expect-error - Testing with invalid tool
      result.current.setTool('invalidTool');
    });
    
    // Tool should remain unchanged
    expect(result.current.tool).toBe(DrawingMode.SELECT);
    expect(toast.error).toHaveBeenCalledWith('Invalid drawing tool selected');
  });
  
  it('can start and end drawing operations', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Initial state
    expect(result.current.isDrawing).toBe(false);
    
    // Set tool to DRAW
    act(() => {
      result.current.setTool(DrawingMode.DRAW);
    });
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // End drawing
    act(() => {
      result.current.endDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('handles tool transitions during active drawing', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Set tool to DRAW
    act(() => {
      result.current.setTool(DrawingMode.DRAW);
    });
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // Change tool during active drawing
    act(() => {
      result.current.setTool(DrawingMode.SELECT);
    });
    
    // Drawing state should be reset when tool changes
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe(DrawingMode.SELECT);
  });
  
  it('maintains correct tool state during drawing operations', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Set tool to STRAIGHT_LINE
    act(() => {
      result.current.setTool(DrawingMode.STRAIGHT_LINE);
    });
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    // Continue drawing
    act(() => {
      result.current.continueDrawing({ x: 150, y: 150 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.tool).toBe(DrawingMode.STRAIGHT_LINE);
    
    // End drawing
    act(() => {
      result.current.endDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe(DrawingMode.STRAIGHT_LINE);
  });
  
  it('properly cancels drawing operations', () => {
    const { result } = renderHook(() => useDrawingTool());
    
    // Set tool to STRAIGHT_LINE
    act(() => {
      result.current.setTool(DrawingMode.STRAIGHT_LINE);
    });
    
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
    expect(result.current.tool).toBe(DrawingMode.STRAIGHT_LINE);
  });
});
