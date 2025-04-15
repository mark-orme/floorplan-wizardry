
/**
 * Unit tests for useLineState hook
 * Tests state management for line drawing functionality
 * 
 * @module hooks/straightLineTool/__tests__/useLineState.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLineState, InputMethod } from '../useLineState';
import { Line, Text, Object as FabricObject } from 'fabric';
import { Point } from '@/types/core/Geometry';

// Mock fabric classes to isolate hook behavior from actual fabric implementation
vi.mock('fabric', () => {
  const mockLine = vi.fn().mockImplementation((points, options) => ({
    set: vi.fn(),
    setCoords: vi.fn()
  }));
  
  const mockText = vi.fn().mockImplementation((text, options) => ({
    set: vi.fn(),
    setCoords: vi.fn()
  }));
  
  return {
    Line: mockLine,
    Text: mockText,
    Object: class MockFabricObject {
      set = vi.fn();
      setCoords = vi.fn();
    }
  };
});

describe('useLineState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with correct default values', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    // Check default state
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isToolInitialized).toBe(false);
    expect(result.current.startPointRef.current).toBeNull();
    expect(result.current.currentLineRef.current).toBeNull();
    expect(result.current.distanceTooltipRef.current).toBeNull();
  });
  
  it('should set the start point and activate drawing', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    const testPoint: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.setStartPoint(testPoint);
    });
    
    // Check that drawing is active and start point is set
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPointRef.current).toEqual(testPoint);
  });
  
  it('should set current line reference', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    // Create a mock line with proper constructor arguments
    // Fabric.js Line requires an array of 4 numbers: [x1, y1, x2, y2]
    const mockLine = new Line([0, 0, 100, 100], {});
    
    act(() => {
      result.current.setCurrentLine(mockLine);
    });
    
    // Check that current line reference is set
    expect(result.current.currentLineRef.current).toBe(mockLine);
  });
  
  it('should set tooltip reference', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    // Create a mock fabric object for the tooltip instead of HTMLDivElement
    const mockTooltip = new (FabricObject as any)();
    
    act(() => {
      result.current.setDistanceTooltip(mockTooltip);
    });
    
    // Check that tooltip reference is set
    expect(result.current.distanceTooltipRef.current).toBe(mockTooltip);
  });
  
  it('should initialize tool state', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    act(() => {
      result.current.initializeTool();
    });
    
    // Check that tool is initialized
    expect(result.current.isToolInitialized).toBe(true);
  });
  
  it('should reset drawing state completely', () => {
    // Create mock props required by the hook
    const mockProps = {
      fabricCanvasRef: { current: null },
      lineThickness: 2,
      lineColor: '#000000'
    };
    
    const { result } = renderHook(() => useLineState(mockProps));
    
    // Set up initial state
    const testPoint: Point = { x: 100, y: 100 };
    const mockLine = new Line([0, 0, 100, 100], {}); // Using proper Line constructor params
    const mockTooltip = new (FabricObject as any)();
    
    act(() => {
      result.current.setStartPoint(testPoint);
      result.current.setCurrentLine(mockLine);
      result.current.setDistanceTooltip(mockTooltip);
    });
    
    // Verify initial state is set
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPointRef.current).toEqual(testPoint);
    expect(result.current.currentLineRef.current).toBe(mockLine);
    expect(result.current.distanceTooltipRef.current).toBe(mockTooltip);
    
    // Reset state
    act(() => {
      result.current.resetDrawingState();
    });
    
    // Verify everything is reset
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPointRef.current).toBeNull();
    expect(result.current.currentLineRef.current).toBeNull();
    expect(result.current.distanceTooltipRef.current).toBeNull();
  });
});
