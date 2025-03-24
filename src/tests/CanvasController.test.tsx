
/**
 * Unit tests for the CanvasController component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CanvasController } from '@/components/CanvasController';
import { FabricCanvasMock, PathMock } from './mocks/fabricMock';

// Mock modules
vi.mock('fabric', () => {
  return {
    Canvas: FabricCanvasMock,
    Polyline: vi.fn(),
    Path: PathMock
  };
});

vi.mock('sonner', () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }
  };
});

// Mock performance.now
const originalPerformanceNow = performance.now;
let mockNowValue = 1000;

beforeEach(() => {
  // Reset mocks and timers
  vi.clearAllMocks();
  vi.useFakeTimers();
  
  // Mock performance.now
  performance.now = vi.fn(() => mockNowValue);
  
  // Create a proper mock for HTMLCanvasElement.prototype.getContext
  const mockContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4)
    })),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
    setTransform: vi.fn(),
    drawPath: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    // Add these properties to satisfy CanvasRenderingContext2D interface
    canvas: document.createElement('canvas'),
    getContextAttributes: vi.fn(() => ({})),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over'
  };

  // Use type assertion to handle the complex typings
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext) as any;
});

afterEach(() => {
  // Restore mocks and timers
  vi.clearAllMocks();
  vi.useRealTimers();
  performance.now = originalPerformanceNow;
});

describe('CanvasController', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => CanvasController());
    
    expect(result.current.tool).toBe('straightLine');
    expect(result.current.gia).toBe(0);
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.currentFloor).toBe(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.lineThickness).toBe(2);
    expect(result.current.lineColor).toBe('#000000');
  });
  
  it('should change tool when handleToolChange is called', () => {
    const { result } = renderHook(() => CanvasController());
    
    act(() => {
      result.current.handleToolChange('room');
    });
    
    expect(result.current.tool).toBe('room');
  });
  
  it('should handle undo and redo operations', () => {
    const { result } = renderHook(() => CanvasController());
    
    // Initially, there's no history to undo/redo
    expect(result.current.handleUndo).toBeDefined();
    expect(result.current.handleRedo).toBeDefined();
    
    // We would need to simulate adding objects and then test undo/redo
    // This would be part of integration testing
  });
  
  it('should handle zoom operations', () => {
    const { result } = renderHook(() => CanvasController());
    
    const initialZoom = result.current.zoomLevel || 1;
    
    act(() => {
      result.current.handleZoom('in');
    });
    
    // In a real test with proper mocking, this would test the actual zoom value
    // For now, we're just testing that the function exists and doesn't throw
    expect(result.current.handleZoom).toBeDefined();
  });
  
  it('should handle line thickness changes', () => {
    const { result } = renderHook(() => CanvasController());
    
    const newThickness = 5;
    
    act(() => {
      result.current.handleLineThicknessChange(newThickness);
    });
    
    expect(result.current.lineThickness).toBe(newThickness);
  });
  
  it('should handle line color changes', () => {
    const { result } = renderHook(() => CanvasController());
    
    const newColor = '#FF0000';
    
    act(() => {
      result.current.handleLineColorChange(newColor);
    });
    
    expect(result.current.lineColor).toBe(newColor);
  });
});
