
/**
 * History edge case regression tests
 * Tests for the undo/redo functionality in edge cases
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { createMockCanvas } from '@/tests/utils/canvasTestUtils';

// Mock the useDrawingHistory hook
vi.mock('@/hooks/useDrawingHistory', () => ({
  useDrawingHistory: vi.fn()
}));

// Test component that uses the hook
const TestComponent: React.FC = () => {
  const {
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    saveCurrentState
  } = useDrawingHistory({
    fabricCanvasRef: { current: createMockCanvas() },
    gridLayerRef: { current: [] },
    historyRef: { current: { past: [], future: [] } },
    clearDrawings: vi.fn(),
    recalculateGIA: vi.fn()
  });

  return (
    <div>
      <button data-testid="undo-btn" onClick={handleUndo} disabled={!canUndo}>
        Undo
      </button>
      <button data-testid="redo-btn" onClick={handleRedo} disabled={!canRedo}>
        Redo
      </button>
      <button data-testid="save-state-btn" onClick={saveCurrentState}>
        Save State
      </button>
    </div>
  );
};

describe('Drawing History Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should disable Undo button when canUndo is false', () => {
    const mockHistoryHook = {
      handleUndo: vi.fn(),
      handleRedo: vi.fn(),
      canUndo: false,
      canRedo: true,
      saveCurrentState: vi.fn()
    };
    
    (useDrawingHistory as any).mockReturnValue(mockHistoryHook);
    
    render(<TestComponent />);
    
    const undoBtn = screen.getByTestId('undo-btn');
    expect(undoBtn).toBeDisabled();
    
    // Click should not trigger the handler when disabled
    fireEvent.click(undoBtn);
    expect(mockHistoryHook.handleUndo).not.toHaveBeenCalled();
  });
  
  it('should disable Redo button when canRedo is false', () => {
    const mockHistoryHook = {
      handleUndo: vi.fn(),
      handleRedo: vi.fn(),
      canUndo: true,
      canRedo: false,
      saveCurrentState: vi.fn()
    };
    
    (useDrawingHistory as any).mockReturnValue(mockHistoryHook);
    
    render(<TestComponent />);
    
    const redoBtn = screen.getByTestId('redo-btn');
    expect(redoBtn).toBeDisabled();
    
    // Click should not trigger the handler when disabled
    fireEvent.click(redoBtn);
    expect(mockHistoryHook.handleRedo).not.toHaveBeenCalled();
  });
  
  it('should call saveCurrentState when save button is clicked', () => {
    const mockHistoryHook = {
      handleUndo: vi.fn(),
      handleRedo: vi.fn(),
      canUndo: true,
      canRedo: true,
      saveCurrentState: vi.fn()
    };
    
    (useDrawingHistory as any).mockReturnValue(mockHistoryHook);
    
    render(<TestComponent />);
    
    const saveBtn = screen.getByTestId('save-state-btn');
    fireEvent.click(saveBtn);
    expect(mockHistoryHook.saveCurrentState).toHaveBeenCalled();
  });
});
