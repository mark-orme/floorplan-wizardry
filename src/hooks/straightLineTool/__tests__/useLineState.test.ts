
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { Canvas } from 'fabric';
import { vi } from 'vitest';
import { createMockFunctionParams, createTestPoint } from '@/utils/test/mockUtils';

// Mock dependencies
vi.mock('@/utils/geometry/distanceCalculation', () => ({
  calculateDistance: vi.fn().mockReturnValue(100)
}));

vi.mock('@/utils/fabric/fabricObjectCreation', () => ({
  createFabricLine: vi.fn().mockReturnValue({
    id: 'mock-line-id',
    set: vi.fn()
  })
}));

describe('useLineState', () => {
  let mockCanvas: Canvas;
  const mockSaveCurrentState = vi.fn();
  
  beforeEach(() => {
    mockCanvas = {
      on: vi.fn(),
      off: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      clear: vi.fn(),
      renderAll: vi.fn()
    } as unknown as Canvas;
    
    mockSaveCurrentState.mockClear();
  });
  
  it('initializes with default state', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef: { current: null },
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
    expect(result.current.currentLine).toBeNull();
  });
  
  it('initializes tool when canvas is provided', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    act(() => {
      result.current.initializeTool();
    });
    
    expect(result.current.isActive).toBe(true);
    expect(result.current.isToolInitialized).toBe(true);
  });
  
  it('starts drawing at given point', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    act(() => {
      result.current.initializeTool();
      result.current.startDrawing(createTestPoint(100, 100));
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual({ x: 100, y: 100 });
  });
  
  it('continues drawing and updates the line', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    act(() => {
      result.current.initializeTool();
      result.current.startDrawing(createTestPoint(100, 100));
      result.current.continueDrawing(createTestPoint(200, 200));
    });
    
    expect(result.current.currentPoint).toEqual({ x: 200, y: 200 });
  });
  
  it('completes drawing and finalizes the line', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    act(() => {
      result.current.initializeTool();
      result.current.startDrawing(createTestPoint(100, 100));
      result.current.continueDrawing(createTestPoint(200, 200));
      result.current.completeDrawing(createTestPoint(200, 200));
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(mockSaveCurrentState).toHaveBeenCalled();
  });
  
  it('cancels drawing and removes temporary elements', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    act(() => {
      result.current.initializeTool();
      result.current.startDrawing(createTestPoint(100, 100));
      result.current.continueDrawing(createTestPoint(200, 200));
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(mockCanvas.remove).toHaveBeenCalled();
    expect(mockSaveCurrentState).not.toHaveBeenCalled(); // Shouldn't save when canceling
  });
  
  it('toggles snapping feature', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    expect(result.current.snapEnabled).toBe(true); // Default is true
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('toggles angle constraints', () => {
    const { result } = renderHook(() => useLineState(
      createMockFunctionParams({
        fabricCanvasRef: { current: mockCanvas },
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: mockSaveCurrentState
      })
    ));
    
    expect(result.current.anglesEnabled).toBe(false); // Default is false
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.anglesEnabled).toBe(true);
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.anglesEnabled).toBe(false);
  });
});
