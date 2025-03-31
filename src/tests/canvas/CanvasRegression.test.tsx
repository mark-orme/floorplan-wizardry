
/**
 * Canvas regression tests
 * Ensures canvas and grid render correctly and tools register properly
 * @module tests/canvas/CanvasRegression.test
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas } from '@/components/Canvas';
import { DrawingMode } from '@/constants/drawingModes';

// Mock fabric.js to isolate testing
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      setActiveObject: vi.fn(),
      discardActiveObject: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      clear: vi.fn(),
      dispose: vi.fn(),
      setZoom: vi.fn(),
      getZoom: vi.fn().mockReturnValue(1),
      on: vi.fn(),
      off: vi.fn(),
      isDrawingMode: false,
      freeDrawingBrush: {
        color: '#000000',
        width: 1
      },
      selection: true,
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      width: 800,
      height: 600,
      requestRenderAll: vi.fn(),
      getContext: vi.fn().mockReturnValue({})
    })),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: '#000000',
      width: 1
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      set: vi.fn(),
      id: Math.random().toString(36).substring(7)
    })),
    Object: {
      prototype: {}
    },
    Point: vi.fn().mockImplementation((x, y) => ({ x, y }))
  };
});

// Mock toast for testing
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Canvas Component Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders canvas element correctly', async () => {
    const onCanvasReady = vi.fn();
    
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady} 
      />
    );
    
    const canvasElement = document.querySelector('canvas');
    expect(canvasElement).toBeInTheDocument();
    
    // Verify canvas is initialized
    await waitFor(() => {
      expect(onCanvasReady).toHaveBeenCalled();
    });
  });
  
  it('initializes with proper default settings', async () => {
    let capturedCanvas: any = null;
    const onCanvasReady = vi.fn((canvas) => {
      capturedCanvas = canvas;
    });
    
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady} 
      />
    );
    
    await waitFor(() => {
      expect(onCanvasReady).toHaveBeenCalled();
      expect(capturedCanvas).not.toBeNull();
    });
    
    // Verify default settings
    expect(capturedCanvas.isDrawingMode).toBe(false);
    expect(capturedCanvas.selection).toBe(true);
    expect(capturedCanvas.freeDrawingBrush.color).toBe('#000000');
  });
  
  it('renders grid when canvas is ready', async () => {
    let capturedCanvas: any = null;
    const onCanvasReady = vi.fn((canvas) => {
      capturedCanvas = canvas;
    });
    
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady} 
      />
    );
    
    await waitFor(() => {
      expect(onCanvasReady).toHaveBeenCalled();
    });
    
    // The add method should be called multiple times for grid lines
    expect(capturedCanvas.add).toHaveBeenCalled();
  });
  
  it('updates tool state when tool prop changes', async () => {
    const onCanvasReady = vi.fn();
    
    // Initial render with SELECT
    const { rerender } = render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady} 
        tool={DrawingMode.SELECT}
      />
    );
    
    await waitFor(() => {
      expect(onCanvasReady).toHaveBeenCalled();
    });
    
    // Re-render with DRAW
    rerender(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady} 
        tool={DrawingMode.DRAW}
      />
    );
    
    // Should change drawing mode
    await waitFor(() => {
      const fabricCanvas = (global as any).__fabricCanvas;
      expect(fabricCanvas.isDrawingMode).toBe(true);
    });
  });
});
