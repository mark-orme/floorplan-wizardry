
import { renderHook, act } from '@testing-library/react';
import { useLineSettings } from './useLineSettings';
import { toast } from 'sonner';
import { trackLineThickness } from "@/utils/fabricBrush";

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn()
  }
}));

vi.mock('@/utils/fabricBrush', () => ({
  trackLineThickness: vi.fn()
}));

describe('useLineSettings Hook', () => {
  // Setup mock canvas and state
  const mockFabricCanvas = {
    freeDrawingBrush: {
      width: 2,
      color: '#000000'
    }
  };
  
  const mockCanvasRef = { current: mockFabricCanvas };
  const mockSetLineThickness = vi.fn();
  const mockSetLineColor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('handles line thickness changes correctly', () => {
    // Given
    const initialProps = {
      fabricCanvasRef: mockCanvasRef,
      lineThickness: 2,
      lineColor: '#000000',
      setLineThickness: mockSetLineThickness,
      setLineColor: mockSetLineColor
    };

    // When
    const { result } = renderHook(() => useLineSettings(initialProps));
    
    // Then - change thickness to 5
    act(() => {
      result.current.handleLineThicknessChange(5);
    });

    // Verify the state was updated
    expect(mockSetLineThickness).toHaveBeenCalledWith(5);
    
    // Verify the canvas brush was updated
    expect(mockCanvasRef.current.freeDrawingBrush.width).toBe(5);
    
    // Verify tracking function was called
    expect(trackLineThickness).toHaveBeenCalledWith(mockCanvasRef.current, 5);
    
    // Verify toast was shown
    expect(toast.success).toHaveBeenCalled();
  });

  test('handles line color changes correctly', () => {
    // Given
    const initialProps = {
      fabricCanvasRef: mockCanvasRef,
      lineThickness: 2,
      lineColor: '#000000',
      setLineThickness: mockSetLineThickness,
      setLineColor: mockSetLineColor
    };

    // When
    const { result } = renderHook(() => useLineSettings(initialProps));
    
    // Then - change color to red
    act(() => {
      result.current.handleLineColorChange('#FF0000');
    });

    // Verify the state was updated
    expect(mockSetLineColor).toHaveBeenCalledWith('#FF0000');
    
    // Verify the canvas brush was updated
    expect(mockCanvasRef.current.freeDrawingBrush.color).toBe('#FF0000');
    
    // Verify toast was shown
    expect(toast.success).toHaveBeenCalled();
  });

  test('applies line settings to canvas brush', () => {
    // Given
    const initialProps = {
      fabricCanvasRef: mockCanvasRef,
      lineThickness: 3,
      lineColor: '#00FF00',
      setLineThickness: mockSetLineThickness,
      setLineColor: mockSetLineColor
    };

    // When
    const { result } = renderHook(() => useLineSettings(initialProps));
    
    // Reset the brush to ensure we're testing the apply function
    mockCanvasRef.current.freeDrawingBrush.width = 1;
    mockCanvasRef.current.freeDrawingBrush.color = '#000000';
    
    // Then - apply settings
    act(() => {
      result.current.applyLineSettings();
    });

    // Verify the canvas brush was updated with initial values
    expect(mockCanvasRef.current.freeDrawingBrush.width).toBe(3);
    expect(mockCanvasRef.current.freeDrawingBrush.color).toBe('#00FF00');
    
    // Verify tracking function was called
    expect(trackLineThickness).toHaveBeenCalledWith(mockCanvasRef.current, 3);
  });

  test('handles missing canvas gracefully', () => {
    // Given - canvas ref with no current value
    const emptyCanvasRef = { current: null };
    const initialProps = {
      fabricCanvasRef: emptyCanvasRef,
      lineThickness: 2,
      lineColor: '#000000',
      setLineThickness: mockSetLineThickness,
      setLineColor: mockSetLineColor
    };

    // When
    const { result } = renderHook(() => useLineSettings(initialProps));
    
    // Then - operations should not throw errors
    act(() => {
      result.current.handleLineThicknessChange(5);
      result.current.handleLineColorChange('#FF0000');
      result.current.applyLineSettings();
    });

    // State should be updated even if canvas is not available
    expect(mockSetLineThickness).toHaveBeenCalledWith(5);
    expect(mockSetLineColor).toHaveBeenCalledWith('#FF0000');
    
    // But tracking function should not be called
    expect(trackLineThickness).not.toHaveBeenCalled();
  });
});
