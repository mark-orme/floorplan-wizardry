
/**
 * Tests for the useLineState hook
 * @module hooks/straightLineTool/__tests__/useLineState
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { InputMethod } from '../useLineInputMethod';
import { Canvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';

// Mock fabric objects
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      isDrawingMode: false,
      selection: true,
      defaultCursor: 'default',
      hoverCursor: 'default'
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      set: vi.fn(),
      x1: points[0],
      y1: points[1],
      x2: points[2],
      y2: points[3],
      ...options
    })),
    Text: vi.fn().mockImplementation((text, options) => ({
      set: vi.fn(),
      text,
      ...options
    }))
  };
});

// Mock other necessary dependencies
vi.mock('@/utils/sentryUtils', () => ({
  captureError: vi.fn()
}));

vi.mock('@/hooks/useSnapToGrid', () => ({
  useSnapToGrid: () => ({
    snapPointToGrid: (point: any) => point
  })
}));

describe('useLineState', () => {
  let fabricCanvasRef: { current: Canvas | null };
  const mockSaveCurrentState = vi.fn();
  
  beforeEach(() => {
    fabricCanvasRef = { current: new Canvas() as any };
    vi.clearAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isToolInitialized).toBe(false);
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentLine).toBeNull();
    expect(result.current.distanceTooltip).toBeNull();
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.inputMethod).toBe(InputMethod.MOUSE);
  });
  
  it('should create a line with correct properties', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#ff0000',
      lineThickness: 3,
      saveCurrentState: mockSaveCurrentState
    }));
    
    // Fixed: Changed to use the createLine function properly with start and end points
    const start = { x: 10, y: 20 };
    const end = { x: 30, y: 40 };
    const line = result.current.createLine(start, end);
    
    expect(line).toBeDefined();
    expect(Line).toHaveBeenCalledWith([start.x, start.y, end.x, end.y], expect.objectContaining({
      stroke: '#ff0000',
      strokeWidth: 3,
      selectable: true
    }));
  });
  
  it('should create a distance tooltip with correct properties', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    // Fixed: Changed to use the createDistanceTooltip function properly with midpoint and distance
    const midpoint = { x: 100, y: 200 };
    const distance = 150;
    const tooltip = result.current.createDistanceTooltip(midpoint, distance);
    
    expect(tooltip).toBeDefined();
    expect(Text).toHaveBeenCalledWith(expect.stringContaining('150px'), expect.objectContaining({
      left: 100,
      top: 200,
      fontSize: 14,
      fill: expect.any(String),
      selectable: false
    }));
  });
  
  it('should start drawing correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    const mockPoint = { x: 100, y: 200 };
    
    act(() => {
      result.current.startDrawing(mockPoint);
    });
    
    expect(result.current.startPoint).toEqual(mockPoint);
  });
  
  it('should handle continuing drawing', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    const startPoint = { x: 100, y: 100 };
    const currentPoint = { x: 200, y: 200 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.continueDrawing(currentPoint);
    });
    
    expect(result.current.currentPoint).toEqual(currentPoint);
  });
  
  it('should initialize the tool correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    act(() => {
      result.current.initializeTool();
    });
    
    expect(result.current.isToolInitialized).toBe(true);
    expect(fabricCanvasRef.current!.selection).toBe(false);
    expect(fabricCanvasRef.current!.defaultCursor).toBe('crosshair');
    expect(fabricCanvasRef.current!.isDrawingMode).toBe(false);
  });
  
  it('should toggle snap correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    expect(result.current.snapEnabled).toBe(true);
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('should toggle angles correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: mockSaveCurrentState
    }));
    
    expect(result.current.anglesEnabled).toBe(true);
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.anglesEnabled).toBe(false);
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.anglesEnabled).toBe(true);
  });
});
