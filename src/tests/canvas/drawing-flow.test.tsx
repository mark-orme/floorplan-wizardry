
/**
 * Tests for the canvas drawing flow
 * This test validates the overall drawing workflow from start to end
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';

// Mock fabric
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      setDimensions: vi.fn(),
      dispose: vi.fn(),
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      selection: true
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      type: 'line',
      points,
      ...options
    }))
  };
});

// Mock the grid creation utility
vi.mock('@/utils/canvasGrid', () => ({
  createGrid: vi.fn().mockReturnValue([
    { type: 'line', id: 'grid-1' },
    { type: 'line', id: 'grid-2' }
  ])
}));

describe('Canvas Drawing Flow', () => {
  let onCanvasReady: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create fresh mocks for each test
    onCanvasReady = vi.fn();
    onError = vi.fn();
  });
  
  it('should render the canvas component', () => {
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady}
        onError={onError}
      />
    );
    
    // Canvas should be in the document
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toBeInTheDocument();
    
    // FabricCanvas constructor should be called
    expect(FabricCanvas).toHaveBeenCalled();
    
    // onCanvasReady should be called with the canvas instance
    expect(onCanvasReady).toHaveBeenCalled();
  });
  
  it('should handle errors gracefully', () => {
    // Mock implementation to throw error
    (FabricCanvas as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady}
        onError={onError}
      />
    );
    
    // Error handler should be called
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    
    // onCanvasReady should not be called
    expect(onCanvasReady).not.toHaveBeenCalled();
  });
});
