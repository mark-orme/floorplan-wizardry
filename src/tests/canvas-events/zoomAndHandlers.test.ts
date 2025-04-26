
import { renderHook } from '@testing-library/react-hooks';
import { useZoomTracking } from '@/hooks/canvas-events/useZoomTracking';
import { createRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { MockCanvas } from '@/utils/test/createMockCanvas';

// Mock FabricCanvas with properly typed mock
const createMockFabricCanvas = (): Partial<FabricCanvas> => ({
  on: jest.fn(),
  off: jest.fn(),
  getZoom: jest.fn().mockReturnValue(1),
});

// Create properly typed canvas ref
const createMockCanvasRef = () => ({
  current: createMockFabricCanvas() as FabricCanvas | null,
});

describe('useZoomTracking', () => {
  let mockFabricCanvas: Partial<MockCanvas>;
  let mockFabricCanvasRef: { current: FabricCanvas | null };

  beforeEach(() => {
    mockFabricCanvas = createMockFabricCanvas();
    mockFabricCanvasRef = {
      current: mockFabricCanvas as FabricCanvas,
    };
  });

  it('registers zoom tracking', () => {
    const { result } = renderHook(() => useZoomTracking({
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT, // Use enum instead of string literal
      updateZoomLevel: jest.fn()
    }));

    expect(result.current.register).toBeDefined();
    // This is now a void function, don't check return value
    result.current.register();
    expect(mockFabricCanvas.on).toHaveBeenCalled();
  });

  it('unregisters zoom tracking', () => {
    const { result } = renderHook(() => useZoomTracking({
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT, // Use enum instead of string literal
      updateZoomLevel: jest.fn()
    }));

    expect(result.current.unregister).toBeDefined();
    result.current.unregister();
    expect(mockFabricCanvas.off).toHaveBeenCalled();
  });

  it('cleans up zoom tracking', () => {
    const { result } = renderHook(() => useZoomTracking({
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT, // Use enum instead of string literal
      updateZoomLevel: jest.fn()
    }));

    expect(result.current.cleanup).toBeDefined();
    result.current.cleanup();
    expect(mockFabricCanvas.off).toHaveBeenCalled();
  });
});
