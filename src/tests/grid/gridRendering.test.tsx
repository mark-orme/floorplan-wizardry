
/**
 * Tests for grid rendering functionality
 * This test ensures that the grid is properly created and displayed
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { vi } from 'vitest';
import { createGrid } from '@/utils/canvasGrid';

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
      selection: true,
      sendToBack: vi.fn()
    }))
  };
});

// Spy on createGrid instead of mocking it
vi.mock('@/utils/canvasGrid', () => ({
  createGrid: vi.fn().mockReturnValue([
    { type: 'line', id: 'grid-1' },
    { type: 'line', id: 'grid-2' }
  ])
}));

describe('Grid Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should create grid when canvas is initialized', () => {
    const onCanvasReady = vi.fn();
    
    render(
      <Canvas 
        width={800}
        height={600}
        onCanvasReady={onCanvasReady}
      />
    );
    
    // Check that createGrid was called
    expect(createGrid).toHaveBeenCalled();
    
    // onCanvasReady should be called
    expect(onCanvasReady).toHaveBeenCalled();
  });
  
  it('should update debug info when grid is created', () => {
    const onCanvasReady = vi.fn();
    const setDebugInfo = vi.fn();
    
    render(
      <Canvas 
        width={800}
        height={600}
        onCanvasReady={onCanvasReady}
        setDebugInfo={setDebugInfo}
      />
    );
    
    // Check that setDebugInfo was called with grid creation info
    expect(setDebugInfo).toHaveBeenCalledWith(expect.objectContaining({
      gridCreated: true,
      gridRendered: true,
      gridObjectCount: 2 // From our mock return value
    }));
  });
});
