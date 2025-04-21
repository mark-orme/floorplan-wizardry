
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { createCanvasRef } from './testUtils';

describe('Redo Operation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not redo when future is empty', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.canRedo).toBe(false);
    expect(canvasRef.current.clear).not.toHaveBeenCalled();
  });

  it('should perform redo operation after undo', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    // Create history
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
    });
    
    // Undo
    act(() => {
      result.current.undo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
      result.current.historyRef.current.future = [[{ id: 'object-1' }]];
    });
    
    // Now redo should work
    act(() => {
      canvasRef.current.clear.mockClear(); // Reset mock
      result.current.redo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
      result.current.historyRef.current.future = [];
    });
    
    expect(result.current.canRedo).toBe(false);
    expect(canvasRef.current.clear).toHaveBeenCalled();
  });

  it('should keep track of redo state correctly', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    // Create history with multiple states
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }, { id: 'object-2' }]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }], [{ id: 'object-1' }, { id: 'object-2' }]];
    });
    
    // Undo twice
    act(() => {
      result.current.undo();
      result.current.undo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
      result.current.historyRef.current.future = [[{ id: 'object-1' }], [{ id: 'object-1' }, { id: 'object-2' }]];
    });
    
    expect(result.current.canRedo).toBe(true);
    
    // Redo once
    act(() => {
      result.current.redo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
      result.current.historyRef.current.future = [[{ id: 'object-1' }, { id: 'object-2' }]];
    });
    
    expect(result.current.canRedo).toBe(true);
    
    // Redo again
    act(() => {
      result.current.redo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }], [{ id: 'object-1' }, { id: 'object-2' }]];
      result.current.historyRef.current.future = [];
    });
    
    expect(result.current.canRedo).toBe(false);
  });
});
