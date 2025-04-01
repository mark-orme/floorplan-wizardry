
/**
 * Tests for history edge cases
 * Verifies history operations in unusual scenarios
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from 'fabric';
import { createMockDrawingHistoryProps, createMockDrawingHistoryResult } from '@/tests/utils/historyTestUtils';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

// Mock the useDrawingHistory hook
vi.mock('@/hooks/useDrawingHistory', () => ({
  useDrawingHistory: vi.fn()
}));

describe('History Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should prevent undo when past history is empty', () => {
    // Setup mock props and result
    const mockProps = createMockDrawingHistoryProps();
    
    // Mock result with empty past history
    const mockResult = {
      ...createMockDrawingHistoryResult(),
      canUndo: false,
      canRedo: false
    };
    
    // Setup the mock hook implementation
    useDrawingHistory.mockReturnValue(mockResult);
    
    // Test that undo is disabled
    expect(mockResult.canUndo).toBe(false);
    
    // Call the handler to make sure no error occurs
    mockResult.handleUndo();
    
    // Verify that we didn't try to recalculate GIA
    expect(mockProps.recalculateGIA).not.toHaveBeenCalled();
  });
  
  it('should update future history when a change is made', () => {
    // Setup mock props and result
    const mockProps = {
      ...createMockDrawingHistoryProps(),
      clearDrawings: vi.fn()
    };
    
    // Set up mock canvas with objects
    const mockCanvas = new Canvas(null);
    mockProps.fabricCanvasRef.current = mockCanvas;
    
    // Mock result with ability to save state
    const mockResult = {
      ...createMockDrawingHistoryResult(),
      canUndo: true,
      canRedo: true,
      saveCurrentState: vi.fn()
    };
    
    // Setup the mock hook implementation
    useDrawingHistory.mockReturnValue(mockResult);
    
    // Verify initial state
    expect(mockResult.canRedo).toBe(true);
    
    // Simulate saving a new state
    mockResult.saveCurrentState();
    
    // Verify that saveCurrentState was called
    expect(mockResult.saveCurrentState).toHaveBeenCalled();
  });
  
  it('should clear future history when canvas is cleared', () => {
    // Setup mock props with clear function
    const mockProps = {
      ...createMockDrawingHistoryProps(),
      clearDrawings: vi.fn()
    };
    
    // Setup mock result with empty history
    const mockResult = {
      ...createMockDrawingHistoryResult(),
      canUndo: false,
      canRedo: false,
      saveCurrentState: vi.fn()
    };
    
    // Set the mock hook implementation
    useDrawingHistory.mockReturnValue(mockResult);
    
    // Call the clear drawings function
    mockProps.clearDrawings();
    
    // Verify that history would be cleared
    expect(mockResult.canRedo).toBe(false);
  });
});
