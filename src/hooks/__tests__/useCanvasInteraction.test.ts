
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '../useCanvasInteraction';
import { createMockCanvas, createMockObject } from '@/tests/utils/canvasTestUtils';

// Mock the hooks we depend on
vi.mock('../useDrawingMode', () => ({
  useDrawingMode: vi.fn().mockReturnValue({
    drawingMode: 'select',
    setDrawingMode: vi.fn()
  })
}));

describe('useCanvasInteraction', () => {
  let mockCanvas: ReturnType<typeof createMockCanvas>;
  
  beforeEach(() => {
    mockCanvas = createMockCanvas();
    vi.clearAllMocks();
  });
  
  it('should handle selection:created event', () => {
    // Render the hook
    const { result } = renderHook(() => useCanvasInteraction({ 
      canvasRef: { current: mockCanvas as any }
    }));
    
    // Check initial state
    expect(result.current.selectedObject).toBeNull();
    
    // Simulate selection:created event
    const mockObject = createMockObject('rect');
    const mockEvent = {
      target: mockObject
    };
    
    // Get the event handler function and call it
    const onHandler = mockCanvas.on.mock.calls.find(call => call[0] === 'selection:created')?.[1];
    expect(onHandler).toBeDefined();
    
    if (onHandler) {
      onHandler(mockEvent);
    }
    
    // Verify the result
    expect(result.current.selectedObject).toBe(mockObject);
  });
  
  it('should handle non-grid object selection', () => {
    // Render the hook
    const { result } = renderHook(() => useCanvasInteraction({ 
      canvasRef: { current: mockCanvas as any } 
    }));
    
    // Regular object selection
    const regularObject = createMockObject('rect', { id: 'rect1' });
    const mockEvent = {
      target: regularObject
    };
    
    // Get the event handler function and call it
    const onHandler = mockCanvas.on.mock.calls.find(call => call[0] === 'selection:created')?.[1];
    expect(onHandler).toBeDefined();
    
    if (onHandler) {
      onHandler(mockEvent);
    }
    
    // Verify the result - should select the object
    expect(result.current.selectedObject).toBe(regularObject);
  });
  
  it('should ignore grid object selection', () => {
    // Render the hook
    const { result } = renderHook(() => useCanvasInteraction({ 
      canvasRef: { current: mockCanvas as any } 
    }));
    
    // Grid object selection
    const gridObject = createMockObject('line', { objectType: 'grid', id: 'grid1' });
    const mockEvent = {
      target: gridObject
    };
    
    // Get the event handler function and call it
    const onHandler = mockCanvas.on.mock.calls.find(call => call[0] === 'selection:created')?.[1];
    expect(onHandler).toBeDefined();
    
    if (onHandler) {
      onHandler(mockEvent);
    }
    
    // Verify the result - should NOT select the grid object
    expect(result.current.selectedObject).toBeNull();
  });
});
