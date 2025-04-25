/**
 * Tests for Canvas component
 * @module components/__tests__/Canvas
 */
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas } from '@/components/Canvas';
import * as fabricModule from 'fabric';

// Mock fabric
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    renderAll: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    clear: vi.fn(),
    requestRenderAll: vi.fn(),
    setZoom: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    }
  }))
}));

describe('Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders canvas element with correct dimensions', () => {
    const width = 800;
    const height = 600;
    
    render(
      <Canvas
        width={width}
        height={height}
        onCanvasReady={vi.fn()}
      />
    );
    
    // Find the canvas element using the data-testid attribute
    const canvasElement = document.querySelector('[data-testid="canvas"]');
    
    // Check that it has the correct dimensions
    expect(canvasElement).toHaveAttribute('width', width.toString());
    expect(canvasElement).toHaveAttribute('height', height.toString());
  });
  
  it('calls onCanvasReady when canvas is initialized', () => {
    const onCanvasReady = vi.fn();
    
    render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={onCanvasReady}
      />
    );
    
    // onCanvasReady should be called after canvas initialization
    expect(onCanvasReady).toHaveBeenCalled();
  });
  
  it('handles onError callback when provided', () => {
    const onError = vi.fn();
    
    // Mock fabric.Canvas to throw an error
    const fabricError = new Error('Canvas initialization failed');
    vi.spyOn(fabricModule, 'Canvas').mockImplementationOnce(() => {
      throw fabricError;
    });
    
    render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={vi.fn()}
        onError={onError}
      />
    );
    
    // onError should be called with the error
    expect(onError).toHaveBeenCalledWith(fabricError);
  });
  
  it('properly cleans up canvas on unmount', () => {
    const disposeMethod = vi.fn(() => {});
    vi.spyOn(fabricModule, 'Canvas').mockImplementationOnce(() => ({
      add: vi.fn(),
      setWidth: vi.fn(),
      setHeight: vi.fn(),
      renderAll: vi.fn(),
      dispose: disposeMethod,
      on: vi.fn(),
      off: vi.fn(),
      getObjects: vi.fn().mockReturnValue([])
    }));
    
    const { unmount } = render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={vi.fn()}
      />
    );
    
    unmount();
    
    // Canvas dispose should be called
    expect(disposeMethod).toHaveBeenCalled();
  });
  
  it('applies additional styles when provided', () => {
    const style = { border: '1px solid black' };
    
    render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={vi.fn()}
        style={style}
      />
    );
    
    // Find the canvas element
    const canvasElement = document.querySelector('[data-testid="canvas"]');
    
    // Check that it has the correct style
    Object.entries(style).forEach(([prop, value]) => {
      expect(canvasElement).toHaveStyle({ [prop]: value });
    });
  });
});
