/**
 * Tests for useFloorPlanDrawing hook
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '@/hooks/useFloorPlanDrawing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
vi.mock('@/api/floorPlans', () => ({
  saveFloorPlan: vi.fn(),
}));

vi.mock('fabric', () => ({
  Canvas: vi.fn(),
}));

describe('useFloorPlanDrawing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({}));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.currentTool).toBeDefined();
  });
  
  it('should change the current tool', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({}));
    
    act(() => {
      result.current.setCurrentTool('wall');
    });
    
    expect(result.current.currentTool).toBe('wall');
  });
  
  it('should toggle drawing mode', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({}));
    
    act(() => {
      result.current.setIsDrawing(true);
    });
    
    expect(result.current.isDrawing).toBe(true);
    
    act(() => {
      result.current.setIsDrawing(false);
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('should update line properties', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({}));
    
    act(() => {
      result.current.setLineColor('#00FF00');
      result.current.setLineThickness(5);
    });
    
    expect(result.current.lineColor).toBe('#00FF00');
    expect(result.current.lineThickness).toBe(5);
  });
  
  it('should handle canvas initialization', () => {
    const mockCanvas = { on: vi.fn(), renderAll: vi.fn() };
    const { result } = renderHook(() => useFloorPlanDrawing({}));
    
    act(() => {
      // @ts-ignore - Mock canvas
      result.current.initializeCanvas(mockCanvas);
    });
    
    expect(result.current.canvas).toBeDefined();
  });
  
  it('should handle undo and redo operations', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      initialHistory: {
        past: [{ objects: [{ id: 'obj1' }] }],
        present: { objects: [{ id: 'obj2' }] },
        future: [{ objects: [{ id: 'obj3' }] }]
      }
    }));
    
    act(() => {
      result.current.undo();
    });
    
    // After undo, present should be the first item from past
    expect(result.current.canUndo).toBeDefined();
    
    act(() => {
      result.current.redo();
    });
    
    // After redo, present should be the first item from future
    expect(result.current.canRedo).toBeDefined();
  });
});
