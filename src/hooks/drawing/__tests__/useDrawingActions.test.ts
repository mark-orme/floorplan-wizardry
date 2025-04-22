
import { renderHook } from '@testing-library/react-hooks';
import { useDrawingActions } from '../useDrawingActions';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn()
  }
}));

describe('useDrawingActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return drawing action handlers', () => {
    const { result } = renderHook(() => useDrawingActions());
    
    expect(result.current.handleUndo).toBeDefined();
    expect(result.current.handleRedo).toBeDefined();
    expect(result.current.handleClear).toBeDefined();
    expect(result.current.handleSave).toBeDefined();
  });

  it('should show toast when undo is called', () => {
    const { result } = renderHook(() => useDrawingActions());
    
    result.current.handleUndo();
    
    expect(toast.info).toHaveBeenCalledWith('Undo action');
  });

  it('should show toast when redo is called', () => {
    const { result } = renderHook(() => useDrawingActions());
    
    result.current.handleRedo();
    
    expect(toast.info).toHaveBeenCalledWith('Redo action');
  });

  it('should show toast when clear is called', () => {
    const { result } = renderHook(() => useDrawingActions());
    
    result.current.handleClear();
    
    expect(toast.info).toHaveBeenCalledWith('Clear canvas');
  });

  it('should show toast when save is called', () => {
    const { result } = renderHook(() => useDrawingActions());
    
    result.current.handleSave();
    
    expect(toast.success).toHaveBeenCalledWith('Saved successfully');
  });
});
