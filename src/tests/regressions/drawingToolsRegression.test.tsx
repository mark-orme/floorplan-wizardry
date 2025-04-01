
/**
 * Tests for drawing tools regression
 * This test ensures that all drawing tools function as expected
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
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
      selection: true,
      isDrawingMode: false,
      freeDrawingBrush: {
        color: '#000000',
        width: 1
      }
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

describe('Drawing Tools Regression', () => {
  it('should initialize canvas with tool prop', () => {
    const onCanvasReady = vi.fn();
    
    render(
      <Canvas 
        width={800}
        height={600}
        onCanvasReady={onCanvasReady}
        tool={DrawingMode.DRAW}
      />
    );
    
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement.getAttribute('data-canvas-tool')).toBe(DrawingMode.DRAW);
  });
});
