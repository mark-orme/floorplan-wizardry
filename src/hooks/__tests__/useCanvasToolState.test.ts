
/**
 * Tests for useCanvasToolState hook
 * @module hooks/__tests__/useCanvasToolState
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasToolState } from '@/hooks/canvas/controller/useCanvasToolState';
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { createMockCanvas } from '@/utils/test/mockFabricCanvas';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('useCanvasToolState', () => {
  let mockCanvas: FabricCanvas;
  let mockCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas = createMockCanvas();
    mockCanvasRef = { current: mockCanvas };
  });
  
  it('should validate drawing tools correctly', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#000000',
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Valid tools
    expect(result.current.isValidDrawingTool(DrawingMode.SELECT)).toBe(true);
    expect(result.current.isValidDrawingTool(DrawingMode.DRAW)).toBe(true);
    
    // Invalid tools
    expect(result.current.isValidDrawingTool('invalidTool')).toBe(false);
    expect(result.current.isValidDrawingTool(null)).toBe(false);
    expect(result.current.isValidDrawingTool(123)).toBe(false);
  });
  
  it('should handle tool change correctly', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#FF0000',
      zoomLevel: 1,
      setZoomLevel
    }));
    
    act(() => {
      result.current.handleToolChange(DrawingMode.DRAW);
    });
    
    // Should set the tool
    expect(setTool).toHaveBeenCalledWith(DrawingMode.DRAW);
    
    // Should set canvas drawing mode
    expect(mockCanvas.isDrawingMode).toBe(true);
    
    // Should set brush properties
    expect(mockCanvas.freeDrawingBrush.color).toBe('#FF0000');
    expect(mockCanvas.freeDrawingBrush.width).toBe(2);
    
    // Should show success toast
    expect(toast.success).toHaveBeenCalledWith(`Changed to ${DrawingMode.DRAW} tool`);
  });
  
  it('should reject invalid tool changes', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#000000',
      zoomLevel: 1,
      setZoomLevel
    }));
    
    act(() => {
      // @ts-expect-error - Testing with invalid tool
      result.current.handleToolChange('invalidTool');
    });
    
    // Should not set the tool
    expect(setTool).not.toHaveBeenCalled();
    
    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Invalid drawing tool selected');
    expect(logger.error).toHaveBeenCalled();
  });
  
  it('should handle zoom correctly', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    const initialZoom = 1;
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#000000',
      zoomLevel: initialZoom,
      setZoomLevel
    }));
    
    // Test zooming in (multiply by 1.1)
    act(() => {
      result.current.handleZoom(1.1);
    });
    
    // Should update zoom level
    expect(setZoomLevel).toHaveBeenCalledWith(initialZoom * 1.1);
    
    // Should set canvas zoom
    expect(mockCanvas.setZoom).toHaveBeenCalledWith(initialZoom * 1.1);
    
    // Should update render
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    
    // Should show toast
    expect(toast.success).toHaveBeenCalledWith(`Zoom set to ${Math.round(initialZoom * 1.1 * 100)}%`);
  });
  
  it('should handle missing canvas gracefully', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    const emptyCanvasRef = { current: null };
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: emptyCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#000000',
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // These operations should not throw errors when canvas is null
    act(() => {
      result.current.handleToolChange(DrawingMode.DRAW);
      result.current.handleZoom(1.1);
    });
    
    // Tool should still be set even without canvas
    expect(setTool).toHaveBeenCalledWith(DrawingMode.DRAW);
    
    // But zoom level should not be changed without canvas
    expect(setZoomLevel).not.toHaveBeenCalled();
  });
  
  it('should handle errors during tool change', () => {
    const setTool = vi.fn();
    const setZoomLevel = vi.fn();
    
    // Simulate an error in canvas operation
    mockCanvas.isDrawingMode = true;
    Object.defineProperty(mockCanvas, 'freeDrawingBrush', {
      get: () => {
        throw new Error('Test error');
      }
    });
    
    const { result } = renderHook(() => useCanvasToolState({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      setTool,
      lineThickness: 2,
      lineColor: '#000000',
      zoomLevel: 1,
      setZoomLevel
    }));
    
    act(() => {
      result.current.handleToolChange(DrawingMode.DRAW);
    });
    
    // Should still set the tool despite error
    expect(setTool).toHaveBeenCalledWith(DrawingMode.DRAW);
    
    // Should log error
    expect(logger.error).toHaveBeenCalled();
    
    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Failed to change tool: Test error');
  });
});
