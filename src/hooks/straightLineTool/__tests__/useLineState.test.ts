
import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { Canvas as FabricCanvas } from 'fabric';

// Mock fabricCanvasRef
const mockCanvas = new FabricCanvas(null);
const fabricCanvasRef = { current: mockCanvas };

// Mock a Point with coordinates
const createPoint = (x: number, y: number) => ({ x, y });

describe('useLineState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.snapToGrid).toBe(true);
    expect(result.current.snapAngles).toBe(true);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
    expect(result.current.temporaryLine).toBeNull();
  });
  
  it('should toggle snap to grid', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapToGrid).toBe(false);
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapToGrid).toBe(true);
  });
  
  it('should toggle snap angles', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.snapAngles).toBe(false);
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.snapAngles).toBe(true);
  });
  
  it('should start drawing at the given point', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    const startPoint = createPoint(100, 100);
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual(startPoint);
    expect(result.current.currentPoint).toEqual(startPoint);
  });
  
  it('should update current point during drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    const startPoint = createPoint(100, 100);
    const movePoint = createPoint(200, 200);
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.continueDrawing(movePoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual(startPoint);
    expect(result.current.currentPoint).toEqual(movePoint);
  });
  
  it('should complete drawing at the given point', () => {
    const mockSaveCurrentState = jest.fn();
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    const startPoint = createPoint(100, 100);
    const endPoint = createPoint(200, 200);
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.continueDrawing(endPoint);
    });
    
    act(() => {
      result.current.completeDrawing(endPoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(mockSaveCurrentState).toHaveBeenCalled();
  });
  
  it('should cancel drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: jest.fn()
    }));
    
    const startPoint = createPoint(100, 100);
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
    expect(result.current.temporaryLine).toBeNull();
  });
});
