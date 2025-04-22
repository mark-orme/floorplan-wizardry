import { renderHook, act } from '@testing-library/react';
import { useDrawingHistory } from '@/hooks/drawing/useDrawingHistory';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock data
const mockHistory = {
  past: [{ id: 'state1' }, { id: 'state2' }],
  present: { id: 'state3' },
  future: [{ id: 'state4' }]
};

describe('useDrawingHistory', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });
  
  it('should initialize with empty history', () => {
    // Setup - Use a ref object as fabricCanvasRef
    const fabricCanvasRef = { current: {} };
    
    // Act
    const { result } = renderHook(() => useDrawingHistory({
      maxHistorySteps: 10,
      fabricCanvasRef
    }));
    
    // Assert
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.getHistory().pastSteps).toBe(0);
    expect(result.current.getHistory().futureSteps).toBe(0);
  });
  
  it('should save state', () => {
    // Setup
    const fabricCanvasRef = { current: {} };
    
    // Act
    const { result } = renderHook(() => useDrawingHistory({
      maxHistorySteps: 10,
      fabricCanvasRef
    }));
    
    act(() => {
      result.current.saveState();
    });
    
    // Assert that we now have state saved
    expect(result.current.getHistory().pastSteps).toBeGreaterThan(0);
  });
  
  it('should not undo when no history', () => {
    // Setup
    const fabricCanvasRef = { current: {} };
    
    // Act
    const { result } = renderHook(() => useDrawingHistory({
      maxHistorySteps: 10,
      fabricCanvasRef
    }));
    
    act(() => {
      result.current.undo();
    });
    
    // Assert
    expect(result.current.canUndo).toBe(false);
  });
  
  it('should not redo when no future states', () => {
    // Setup
    const fabricCanvasRef = { current: {} };
    
    // Act
    const { result } = renderHook(() => useDrawingHistory({
      maxHistorySteps: 10,
      fabricCanvasRef
    }));
    
    act(() => {
      result.current.redo();
    });
    
    // Assert
    expect(result.current.canRedo).toBe(false);
  });
  
  it('should respect maxHistorySteps', () => {
    // Setup
    const fabricCanvasRef = { current: {} };
    const maxHistorySteps = 2;
    
    // Act
    const { result } = renderHook(() => useDrawingHistory({
      maxHistorySteps,
      fabricCanvasRef
    }));
    
    // Simulate adding 3 states (more than maxHistorySteps)
    act(() => {
      result.current.saveState();
      result.current.saveState();
      result.current.saveState();
    });
    
    // Assert - should only keep maxHistorySteps in past
    expect(result.current.getHistory().pastSteps).toBe(maxHistorySteps);
  });
});
