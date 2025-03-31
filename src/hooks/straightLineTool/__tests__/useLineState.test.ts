
/**
 * Unit tests for useLineState hook
 * Tests state management for line drawing functionality
 * 
 * @module hooks/straightLineTool/__tests__/useLineState.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLineState } from '../useLineState';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';

// Mock fabric classes to isolate hook behavior from actual fabric implementation
vi.mock('fabric', () => {
  const mockLine = vi.fn().mockImplementation(() => ({
    set: vi.fn(),
  }));
  
  const mockText = vi.fn().mockImplementation(() => ({
    set: vi.fn(),
  }));
  
  return {
    Line: mockLine,
    Text: mockText
  };
});

describe('useLineState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useLineState());
    
    // Check default state
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isToolInitialized).toBe(false);
    expect(result.current.startPointRef.current).toBeNull();
    expect(result.current.currentLineRef.current).toBeNull();
    expect(result.current.distanceTooltipRef.current).toBeNull();
  });
  
  it('should set the start point and activate drawing', () => {
    const { result } = renderHook(() => useLineState());
    
    const testPoint: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.setStartPoint(testPoint);
    });
    
    // Check that drawing is active and start point is set
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPointRef.current).toEqual(testPoint);
  });
  
  it('should set current line reference', () => {
    const { result } = renderHook(() => useLineState());
    
    // Create a mock line with empty constructor arguments
    const mockLine = new Line([], {});
    
    act(() => {
      result.current.setCurrentLine(mockLine);
    });
    
    // Check that current line reference is set
    expect(result.current.currentLineRef.current).toBe(mockLine);
  });
  
  it('should set tooltip reference', () => {
    const { result } = renderHook(() => useLineState());
    
    // Create a mock tooltip with empty constructor arguments
    const mockTooltip = new Text('', {});
    
    act(() => {
      result.current.setDistanceTooltip(mockTooltip);
    });
    
    // Check that tooltip reference is set
    expect(result.current.distanceTooltipRef.current).toBe(mockTooltip);
  });
  
  it('should initialize tool state', () => {
    const { result } = renderHook(() => useLineState());
    
    act(() => {
      result.current.initializeTool();
    });
    
    // Check that tool is initialized
    expect(result.current.isToolInitialized).toBe(true);
  });
  
  it('should reset drawing state completely', () => {
    const { result } = renderHook(() => useLineState());
    
    // Set up initial state
    const testPoint: Point = { x: 100, y: 100 };
    const mockLine = new Line([], {});
    const mockTooltip = new Text('', {});
    
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
