
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { Canvas } from 'fabric';

// Create mock options that match the required interface
const createMockOptions = () => {
  const canvasRef = { current: new Canvas() };
  return {
    fabricCanvasRef: canvasRef,
    lineColor: '#000000',
    lineThickness: 2,
    saveCurrentState: vi.fn()
  };
};

describe('useLineState', () => {
  beforeEach(() => {
    // Reset any shared state or mocks before each test
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.endPoint).toBeNull();
  });

  it('should set start point correctly', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).not.toBeNull();
    expect(result.current.startPoint?.x).toBe(100);
    expect(result.current.startPoint?.y).toBe(100);
  });

  it('should update end point while drawing', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    
    // Start drawing first
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    // Update with continue drawing
    act(() => {
      result.current.continueDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.endPoint).not.toBeNull();
    expect(result.current.endPoint?.x).toBe(200);
    expect(result.current.endPoint?.y).toBe(200);
  });

  it('should finish drawing correctly', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    // Complete drawing
    act(() => {
      result.current.completeDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(false);
  });

  it('should cancel drawing correctly', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    // Cancel drawing
    act(() => {
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.endPoint).toBeNull();
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useLineState(createMockOptions()));
    
    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    // Reset state
    act(() => {
      result.current.resetDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.endPoint).toBeNull();
  });
});
