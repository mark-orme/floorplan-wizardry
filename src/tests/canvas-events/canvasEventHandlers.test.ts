import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useKeyboardEvents } from '@/hooks/canvas-events/useKeyboardEvents';
import { DrawingMode } from '@/constants/drawingModes';
import type { Canvas } from 'fabric';

// Mock event listeners
describe('useKeyboardEvents', () => {
  // Mock event listeners
  let mockAddEventListener: any;
  let mockRemoveEventListener: any;
  
  // Mock handlers
  const mockHandleUndo = vi.fn();
  const mockHandleRedo = vi.fn();
  const mockDeleteSelectedObjects = vi.fn();
  const mockHandleEscape = vi.fn();
  
  // Mock fabric canvas ref
  const mockFabricCanvasRef = {
    current: {} as fabric.Canvas
  };
  
  beforeEach(() => {
    // Mock global event listeners
    mockAddEventListener = vi.spyOn(window, 'addEventListener');
    mockRemoveEventListener = vi.spyOn(window, 'removeEventListener');
    
    // Reset mocks between tests
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    mockAddEventListener.mockRestore();
    mockRemoveEventListener.mockRestore();
  });
  
  test('registers and unregisters keyboard events', () => {
    // When: hook is rendered
    const { result, unmount } = renderHook(() => useKeyboardEvents({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      deleteSelectedObjects: mockDeleteSelectedObjects,
      handleEscape: mockHandleEscape,
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT
    }));
    
    // Then: event listener should be added
    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // When: register is called
    result.current.register();
    
    // Then: event listener should be added again
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    
    // When: unregister is called
    result.current.unregister();
    
    // Then: event listener should be removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // When: hook is unmounted
    unmount();
    
    // Then: event listener should be removed again
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
  });
  
  test('cleanup removes keyboard events', () => {
    // When: hook is rendered and cleanup is called
    const { result } = renderHook(() => useKeyboardEvents({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      deleteSelectedObjects: mockDeleteSelectedObjects,
      handleEscape: mockHandleEscape,
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT
    }));
    result.current.cleanup();
    
    // Then: event listener should be removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
  
  test('calls handleUndo on Ctrl/Cmd + Z', () => {
    // Given: a keydown event for Ctrl/Cmd + Z
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      metaKey: true
    });
    mockAddEventListener.mockImplementation((event: string, cb: Function) => {
      if (event === 'keydown') {
        cb(event);
      }
    });
    
    // When: hook is rendered and event is dispatched
    renderHook(() => useKeyboardEvents({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      deleteSelectedObjects: mockDeleteSelectedObjects,
      handleEscape: mockHandleEscape,
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT
    }));
    window.dispatchEvent(event);
    
    // Then: handleUndo should be called
    expect(mockHandleUndo).toHaveBeenCalled();
  });
  
  test('calls handleRedo on Ctrl/Cmd + Shift + Z', () => {
    // Given: a keydown event for Ctrl/Cmd + Shift + Z
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      metaKey: true,
      shiftKey: true
    });
    mockAddEventListener.mockImplementation((event: string, cb: Function) => {
      if (event === 'keydown') {
        cb(event);
      }
    });
    
    // When: hook is rendered and event is dispatched
    renderHook(() => useKeyboardEvents({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      deleteSelectedObjects: mockDeleteSelectedObjects,
      handleEscape: mockHandleEscape,
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT
    }));
    window.dispatchEvent(event);
    
    // Then: handleRedo should be called
    expect(mockHandleRedo).toHaveBeenCalled();
  });
  
  test('calls deleteSelectedObjects on Delete key', () => {
    // Given: a keydown event for Delete key
    const event = new KeyboardEvent('keydown', {
      key: 'Delete'
    });
    mockAddEventListener.mockImplementation((event: string, cb: Function) => {
      if (event === 'keydown') {
        cb(event);
      }
    });
    
    // When: hook is rendered and event is dispatched
    renderHook(() => useKeyboardEvents({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      deleteSelectedObjects: mockDeleteSelectedObjects,
      handleEscape: mockHandleEscape,
      fabricCanvasRef: mockFabricCanvasRef,
      tool: DrawingMode.SELECT
    }));
    window.dispatchEvent(event);
    
    // Then: deleteSelectedObjects should be called
    expect(mockDeleteSelectedObjects).toHaveBeenCalled();
  });
});
