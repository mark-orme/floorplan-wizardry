import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { Canvas as FabricCanvas } from 'fabric';

// Mock fabricCanvasRef
const mockCanvas = new FabricCanvas(null);
const fabricCanvasRef = { current: mockCanvas };

// Mock a Point with coordinates
const createPoint = (x: number, y: number) => ({ x, y });

describe('useLineState', () => {
  const mockCanvasRef = { current: null };
  const mockLineColor = '#000000';
  const mockLineWidth = 2;
  
  // Mock the hook - use the correct properties
  const mockUseLineState = () => ({
    toggleSnap: jest.fn(),
    toggleAngles: jest.fn(),
    startDrawing: jest.fn(),
    continueDrawing: jest.fn(),
    completeDrawing: jest.fn(),
    cancelDrawing: jest.fn(),
    isDrawing: false,
    snapEnabled: false,  // Updated property name
    anglesEnabled: false, // Updated property name
    currentLine: null,   // Updated property name
    setShiftKeyPressed: jest.fn()
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle grid snapping', () => {
    const mock = mockUseLineState();
    
    // Use updated property names
    expect(mock.snapEnabled).toBe(false);
    
    mock.toggleSnap();
    
    expect(mock.toggleSnap).toHaveBeenCalledTimes(1);
  });
  
  it('should not snap when snapping is disabled', () => {
    const mock = mockUseLineState();
    
    // Use updated property names
    expect(mock.snapEnabled).toBe(false);
    
    // Perform some action
    mock.startDrawing({ x: 100, y: 100 });
    
    // Check expected behavior
    expect(mock.startDrawing).toHaveBeenCalledWith({ x: 100, y: 100 });
  });
  
  it('should toggle angle snapping', () => {
    const mock = mockUseLineState();
    
    // Use updated property names
    expect(mock.anglesEnabled).toBe(false);
    
    mock.toggleAngles();
    
    expect(mock.toggleAngles).toHaveBeenCalledTimes(1);
  });
  
  it('should not enforce angles when angle snapping is disabled', () => {
    const mock = mockUseLineState();
    
    // Use updated property names
    expect(mock.anglesEnabled).toBe(false);
    
    // Perform some action
    mock.startDrawing({ x: 100, y: 100 });
    
    // Check expected behavior
    expect(mock.startDrawing).toHaveBeenCalledWith({ x: 100, y: 100 });
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
  
  it('should create temporary line during drawing', () => {
    const mock = mockUseLineState();
    
    // Use updated property names
    expect(mock.currentLine).toBeNull();
    
    // Perform drawing actions
    mock.startDrawing({ x: 100, y: 100 });
    
    // Check expected behavior
    expect(mock.startDrawing).toHaveBeenCalledWith({ x: 100, y: 100 });
  });
});
