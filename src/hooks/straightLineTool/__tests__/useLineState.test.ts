
/**
 * Tests for the useLineState hook
 * @module hooks/straightLineTool/__tests__/useLineState
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState, InputMethod } from '../useLineState';
import { Canvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Geometry';

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

describe('useLineState', () => {
  let fabricCanvasRef: { current: Canvas | null };
  
  beforeEach(() => {
    fabricCanvasRef = { current: new Canvas() as any };
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isToolInitialized).toBe(false);
    expect(result.current.startPointRef.current).toBeNull();
    expect(result.current.currentLineRef.current).toBeNull();
    expect(result.current.distanceTooltipRef.current).toBeNull();
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.inputMethod).toBe(InputMethod.MOUSE);
  });
  
  it('should create a line with correct properties', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#ff0000',
      lineThickness: 3
    }));
    
    const line = result.current.createLine(10, 20, 30, 40);
    
    expect(line).toBeDefined();
    expect(Line).toHaveBeenCalledWith([10, 20, 30, 40], expect.objectContaining({
      stroke: '#ff0000',
      strokeWidth: 3,
      selectable: true,
      objectType: 'line'
    }));
  });
  
  it('should create a distance tooltip with correct properties', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    const tooltip = result.current.createDistanceTooltip(100, 200, 150);
    
    expect(tooltip).toBeDefined();
    expect(Text).toHaveBeenCalledWith('150px', expect.objectContaining({
      left: 100,
      top: 180,
      fontSize: 12,
      fill: expect.any(String),
      selectable: false,
      objectType: 'tooltip'
    }));
  });
  
  it('should set startPoint correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    const mockPoint = { x: 100, y: 200 };
    
    act(() => {
      result.current.setStartPoint(mockPoint);
    });
    
    expect(result.current.startPointRef.current).toEqual(mockPoint);
  });
  
  it('should set currentLine correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    const mockLine = {} as Line;
    
    act(() => {
      result.current.setCurrentLine(mockLine);
    });
    
    expect(result.current.currentLineRef.current).toBe(mockLine);
  });
  
  it('should update line and tooltip correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    // Create mocks
    const mockLine = { set: vi.fn() } as any;
    const mockTooltip = { set: vi.fn() } as any;
    
    // Set refs
    act(() => {
      result.current.setCurrentLine(mockLine);
      result.current.setDistanceTooltip(mockTooltip);
    });
    
    // Update line and tooltip
    act(() => {
      result.current.updateLineAndTooltip({ x: 0, y: 0 }, { x: 30, y: 40 });
    });
    
    // Verify mockLine.set was called with correct values
    expect(mockLine.set).toHaveBeenCalledWith({
      x1: 0,
      y1: 0,
      x2: 30,
      y2: 40
    });
    
    // Verify mockTooltip.set was called with expected values
    expect(mockTooltip.set).toHaveBeenCalledWith(expect.objectContaining({
      left: expect.any(Number),
      top: expect.any(Number),
      text: expect.stringContaining('50')  // 50px is the distance from (0,0) to (30,40)
    }));
  });
  
  it('should initialize the tool correctly', () => {
    const { result } = renderHook(() => useLineState({
      fabricCanvasRef,
      lineColor: '#000000',
      lineThickness: 2
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
      lineThickness: 2
    }));
    
    // Initial value should be true
    expect(result.current.snapEnabled).toBe(true);
    
    // Toggle it
    act(() => {
      result.current.toggleSnap();
    });
    
    // Should be false now
    expect(result.current.snapEnabled).toBe(false);
    
    // Toggle again
    act(() => {
      result.current.toggleSnap();
    });
    
    // Should be true again
    expect(result.current.snapEnabled).toBe(true);
  });
});
