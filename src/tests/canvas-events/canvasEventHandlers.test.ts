
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePathEvents } from '@/hooks/canvas-events/usePathEvents';
import { useObjectEvents } from '@/hooks/canvas-events/useObjectEvents';
import { useKeyboardEvents } from '@/hooks/canvas-events/useKeyboardEvents';
import { Canvas } from 'fabric';
import { DrawingTool } from '@/hooks/useCanvasState';

describe('Canvas Event Handlers', () => {
  // Mock canvas and references
  let mockCanvas: Canvas;
  let fabricCanvasRef: { current: Canvas | null };
  let mockSaveCurrentState: vi.Mock;
  let mockProcessCreatedPath: vi.Mock;
  let mockHandleMouseUp: vi.Mock;
  let mockDeleteSelectedObjects: vi.Mock;
  let defaultTool: DrawingTool = 'pen';

  beforeEach(() => {
    // Create mock Canvas with event handlers
    mockCanvas = {
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as Canvas;
    
    fabricCanvasRef = { current: mockCanvas };
    mockSaveCurrentState = vi.fn();
    mockProcessCreatedPath = vi.fn();
    mockHandleMouseUp = vi.fn();
    mockDeleteSelectedObjects = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('usePathEvents', () => {
    test('should register path:created event handler', () => {
      // When
      renderHook(() => usePathEvents({
        fabricCanvasRef,
        tool: defaultTool,
        saveCurrentState: mockSaveCurrentState,
        processCreatedPath: mockProcessCreatedPath,
        handleMouseUp: mockHandleMouseUp
      }));
      
      // Then
      expect(mockCanvas.on).toHaveBeenCalledWith('path:created', expect.any(Function));
    });
    
    test('should clean up event handlers on unmount', () => {
      // When
      const { unmount } = renderHook(() => usePathEvents({
        fabricCanvasRef,
        tool: defaultTool,
        saveCurrentState: mockSaveCurrentState,
        processCreatedPath: mockProcessCreatedPath,
        handleMouseUp: mockHandleMouseUp
      }));
      
      unmount();
      
      // Then
      expect(mockCanvas.off).toHaveBeenCalledWith('path:created', expect.any(Function));
    });
  });

  describe('useObjectEvents', () => {
    test('should register object:modified and object:removed event handlers', () => {
      // When
      renderHook(() => useObjectEvents({
        fabricCanvasRef,
        tool: defaultTool,
        saveCurrentState: mockSaveCurrentState
      }));
      
      // Then
      expect(mockCanvas.on).toHaveBeenCalledWith('object:modified', expect.any(Function));
      expect(mockCanvas.on).toHaveBeenCalledWith('object:removed', expect.any(Function));
    });
    
    test('should clean up event handlers on unmount', () => {
      // When
      const { unmount } = renderHook(() => useObjectEvents({
        fabricCanvasRef,
        tool: defaultTool,
        saveCurrentState: mockSaveCurrentState
      }));
      
      unmount();
      
      // Then
      expect(mockCanvas.off).toHaveBeenCalledWith('object:modified', expect.any(Function));
      expect(mockCanvas.off).toHaveBeenCalledWith('object:removed', expect.any(Function));
    });
  });

  describe('useKeyboardEvents', () => {
    test('should register event listener for keydown', () => {
      // Given
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      // When
      const { unmount } = renderHook(() => useKeyboardEvents({
        fabricCanvasRef,
        tool: 'select',
        deleteSelectedObjects: mockDeleteSelectedObjects
      }));
      
      // Then
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      // When unmounted
      unmount();
      
      // Then cleanup happens
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
