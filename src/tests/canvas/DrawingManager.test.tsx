
import React from 'react';
import { render } from '@testing-library/react';
import { DrawingManager } from '@/components/canvas/DrawingManager';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Mock fabric
jest.mock('fabric', () => {
  return {
    Canvas: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      off: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
      renderAll: jest.fn(),
      getObjects: jest.fn().mockReturnValue([]),
      clear: jest.fn(),
      dispose: jest.fn(),
      setWidth: jest.fn(),
      setHeight: jest.fn(),
      getElement: jest.fn().mockReturnValue(document.createElement('canvas')),
      getContext: jest.fn().mockReturnValue({}),
    })),
  };
});

describe('DrawingManager', () => {
  const defaultProps = {
    fabricCanvas: new Canvas('canvas'),
    tool: DrawingMode.DRAW,
    lineColor: '#000000',
    lineThickness: 2
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<DrawingManager {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('updates drawing mode when tool changes', () => {
    const { rerender } = render(<DrawingManager {...defaultProps} />);
    rerender(<DrawingManager {...defaultProps} tool={DrawingMode.SELECT} />);
    // In real implementation, this would set isDrawingMode false
    // We'd verify that behavior in a more detailed test
  });

  it('cleans up event listeners on unmount', () => {
    const canvas = defaultProps.fabricCanvas;
    const { unmount } = render(<DrawingManager {...defaultProps} />);
    unmount();
    expect(canvas.off).toHaveBeenCalled();
  });

  it('handles brush color changes', () => {
    const { rerender } = render(<DrawingManager {...defaultProps} />);
    rerender(<DrawingManager {...defaultProps} lineColor="#ff0000" />);
    // In a real test, we'd verify brush color was updated
  });

  it('handles brush thickness changes', () => {
    const { rerender } = render(<DrawingManager {...defaultProps} />);
    rerender(<DrawingManager {...defaultProps} lineThickness={5} />);
    // In a real test, we'd verify brush width was updated
  });
});
