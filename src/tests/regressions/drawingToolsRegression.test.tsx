
/**
 * Regression tests for drawing tools
 * Ensures that drawing tools work as expected and don't regress in future changes
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
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
      freeDrawingBrush: {
        color: '#000000',
        width: 2
      },
      isDrawingMode: false,
      selection: true
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

describe('Drawing Tools Regression Tests', () => {
  let onCanvasReady: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create fresh mocks for each test
    onCanvasReady = vi.fn();
  });
  
  it('should render the canvas with SELECT tool', () => {
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady}
        tool={DrawingMode.SELECT}
      />
    );
    
    // Canvas should be in the document
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toBeInTheDocument();
    
    // Canvas should have the correct tool data attribute
    expect(canvasElement).toHaveAttribute('data-canvas-tool', DrawingMode.SELECT);
    
    // FabricCanvas constructor should be called
    expect(FabricCanvas).toHaveBeenCalled();
  });

  it('should render the canvas with DRAW tool', () => {
    render(
      <Canvas 
        width={800} 
        height={600} 
        onCanvasReady={onCanvasReady}
        tool={DrawingMode.DRAW}
      />
    );
    
    // Canvas should be in the document
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toBeInTheDocument();
    
    // Canvas should have the correct tool data attribute
    expect(canvasElement).toHaveAttribute('data-canvas-tool', DrawingMode.DRAW);
  });
});
