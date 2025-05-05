
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { mockLineState, createMockCanvas, createMockLine, createCanvasRef } from './mockHelpers';
import { Canvas as FabricCanvas } from 'fabric';

// Mock dependencies
vi.mock('../useLineStateCore', () => ({
  useLineStateCore: () => ({
    isDrawing: false,
    setIsDrawing: vi.fn(),
    startPoint: { x: 0, y: 0 },
    setStartPoint: vi.fn(),
    currentPoint: { x: 0, y: 0 },
    setCurrentPoint: vi.fn()
  })
}));

vi.mock('../useEnhancedGridSnapping', () => ({
  useEnhancedGridSnapping: () => ({
    snapEnabled: true,
    toggleGridSnapping: vi.fn(),
    snapToGrid: vi.fn(point => point)
  })
}));

vi.mock('../useLineAngleSnap', () => ({
  useLineAngleSnap: () => ({
    anglesEnabled: true,
    toggleAngles: vi.fn(),
    snapToAngle: vi.fn((start, end) => end)
  })
}));

vi.mock('../useLineDrawing', () => ({
  useLineDrawing: () => ({
    createLine: vi.fn(),
    updateLine: vi.fn(),
    finalizeLine: vi.fn(),
    removeLine: vi.fn()
  })
}));

describe('useLineState', () => {
  const saveCurrentState = vi.fn();
  // Use the createCanvasRef helper to get a properly typed ref
  const fabricCanvasRef = createCanvasRef();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(result.current.isDrawing).toBeDefined();
    expect(result.current.snapEnabled).toBeDefined();
  });
  
  it('should handle start drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Use the actions exported by useLineState
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
  });
  
  it('should handle continue drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
    });
  });
  
  it('should handle complete drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    act(() => {
      // Use a single object with both properties
      const point = { x: 50, y: 60 };
      result.current.startDrawing(point);
      result.current.completeDrawing();
    });
  });
});
