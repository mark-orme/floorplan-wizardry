
/**
 * Tests for edge cases in history management
 * This test suite verifies proper handling of complex undo/redo scenarios
 */
import { renderHook } from '@testing-library/react-hooks';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { Canvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';
import { createMockDrawingHistoryProps } from '@/tests/utils/historyTestUtils';

// Mock fabric
vi.mock('fabric');

describe('History Edge Cases', () => {
  let mockCanvas: Canvas;
  let mockProps: any;
  
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Create a fresh canvas mock for each test
    mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      clear: vi.fn()
    } as unknown as Canvas;
    
    // Create standard mock props
    mockProps = createMockDrawingHistoryProps();
    mockProps.fabricCanvasRef.current = mockCanvas;
  });
  
  it('should not allow undo when past array is empty', () => {
    // Set up empty history
    mockProps.historyRef.current = {
      past: [],
      future: []
    };
    
    // Render the hook
    const { result } = renderHook(() => useDrawingHistory(mockProps));
    
    // Call undo function
    result.current.handleUndo();
    
    // Should not call canvas methods
    expect(mockCanvas.remove).not.toHaveBeenCalled();
    expect(mockCanvas.add).not.toHaveBeenCalled();
    
    // Verify canUndo is false
    expect(result.current.canUndo).toBe(false);
  });
  
  it('should not allow redo when future array is empty', () => {
    // Set up history with empty future
    mockProps.historyRef.current = {
      past: [['someObjectSnapshot']],
      future: []
    };
    
    // Render the hook
    const { result } = renderHook(() => useDrawingHistory(mockProps));
    
    // Call redo function
    result.current.handleRedo();
    
    // Should not call canvas methods
    expect(mockCanvas.remove).not.toHaveBeenCalled();
    expect(mockCanvas.add).not.toHaveBeenCalled();
    
    // Verify canRedo is false
    expect(result.current.canRedo).toBe(false);
  });
  
  it('should clear future history when saving a new state', () => {
    // Set up existing history with some future states
    mockProps.historyRef.current = {
      past: [['past1'], ['past2']],
      future: [['future1'], ['future2']]
    };
    
    // Mock getObjects to return some test data
    const mockObj1 = { toObject: () => ({ id: 'obj1' }) } as unknown as FabricObject;
    const mockObj2 = { toObject: () => ({ id: 'obj2' }) } as unknown as FabricObject;
    mockCanvas.getObjects = vi.fn().mockReturnValue([mockObj1, mockObj2]);
    
    // Render the hook
    const { result } = renderHook(() => useDrawingHistory(mockProps));
    
    // Save current state
    result.current.saveCurrentState();
    
    // Future should be empty
    expect(mockProps.historyRef.current.future).toEqual([]);
    
    // Past should have new state added
    expect(mockProps.historyRef.current.past.length).toBe(3);
  });
});
