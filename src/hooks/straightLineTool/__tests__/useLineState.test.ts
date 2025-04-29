
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { Canvas as FabricCanvas } from 'fabric';
import type { MutableRefObject } from 'react';
import { describe, it, expect, vi } from 'vitest';

describe('useLineState', () => {
  const mockCanvas = {} as FabricCanvas;
  const fabricCanvasRef = { current: mockCanvas } as MutableRefObject<FabricCanvas>;

  const mockOptions = {
    fabricCanvasRef,
    lineColor: '#000000',
    lineThickness: 2,
    saveCurrentState: vi.fn()
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState(mockOptions));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
  });

  it('should update drawing state on startDrawing', () => {
    const { result } = renderHook(() => useLineState(mockOptions));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual({ x: 10, y: 20 });
  });

  it('should update current point on continueDrawing', () => {
    const { result } = renderHook(() => useLineState(mockOptions));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
    });
    
    expect(result.current.currentPoint).toEqual({ x: 30, y: 40 });
  });

  it('should reset state on completeDrawing', () => {
    const { result } = renderHook(() => useLineState(mockOptions));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
      result.current.completeDrawing({ x: 50, y: 60 });
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
  });
});
