
/**
 * Tests for Canvas component
 * @module components/__tests__/Canvas
 */
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas } from '@/components/Canvas';

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
    
    // Find the canvas element
    const canvasElement = screen.getByTestId('canvas');
    
    // Check that it has the correct dimensions
    expect(canvasElement).toHaveAttribute('width', width.toString());
    expect(canvasElement).toHaveAttribute('height', height.toString());
  });
  
  it('calls onCanvasReady when canvas is initialized', async () => {
    const onCanvasReady = vi.fn();
    
    render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={onCanvasReady}
      />
    );
    
    // onCanvasReady should be called after canvas initialization
    await waitFor(() => {
      expect(onCanvasReady).toHaveBeenCalled();
    });
  });
  
  it('handles onError callback when provided', async () => {
    const onError = vi.fn();
    
    // Mock fabric.Canvas to throw an error
    const fabricError = new Error('Canvas initialization failed');
    vi.mocked(fabric.Canvas).mockImplementationOnce(() => {
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
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(fabricError);
    });
  });
  
  it('properly cleans up canvas on unmount', async () => {
    const { unmount } = render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={vi.fn()}
      />
    );
    
    // Get the dispose method from the mocked canvas
    const disposeMethod = vi.mocked(fabric.Canvas)().dispose;
    
    // Unmount the component
    unmount();
    
    // Canvas dispose should be called
    expect(disposeMethod).toHaveBeenCalled();
  });
  
  it('applies additional styles when provided', () => {
    const className = 'test-class';
    const style = { border: '1px solid black' };
    
    render(
      <Canvas
        width={800}
        height={600}
        onCanvasReady={vi.fn()}
        className={className}
        style={style}
      />
    );
    
    // Find the canvas element
    const canvasElement = screen.getByTestId('canvas');
    
    // Check that it has the correct class
    expect(canvasElement).toHaveClass(className);
    
    // Check that it has the correct style
    expect(canvasElement).toHaveStyle(style);
  });
});
