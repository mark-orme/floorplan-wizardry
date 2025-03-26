
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useZoomTracking } from '@/hooks/canvas-events/useZoomTracking';
import { useCanvasHandlers } from '@/hooks/canvas-events/useCanvasHandlers';
import { Canvas } from 'fabric';
import { DrawingTool } from '@/hooks/useCanvasState';

/**
 * Tests for Canvas Zoom and Handlers functionality
 * Verifies zoom tracking and event handling behaviors
 */
describe('Canvas Zoom and Handlers', () => {
  // Mock canvas and references
  let mockCanvas: Canvas & { fire?: Function };
  let fabricCanvasRef: { current: Canvas | null };
  let mockHandleUndo: ReturnType<typeof vi.fn>;
  let mockHandleRedo: ReturnType<typeof vi.fn>;
  let mockSaveCurrentState: ReturnType<typeof vi.fn>;
  let mockDeleteSelectedObjects: ReturnType<typeof vi.fn>;
  let defaultTool: DrawingTool = 'select';

  beforeEach(() => {
    // Create mock Canvas
    mockCanvas = {
      on: vi.fn(),
      off: vi.fn(),
      getZoom: vi.fn().mockReturnValue(1),
      fire: vi.fn()
    } as unknown as Canvas & { fire?: Function };
    
    fabricCanvasRef = { current: mockCanvas };
    mockHandleUndo = vi.fn();
    mockHandleRedo = vi.fn();
    mockSaveCurrentState = vi.fn();
    mockDeleteSelectedObjects = vi.fn();
  });

  describe('useZoomTracking', () => {
    test('registerZoomTracking should set up event listeners', () => {
      // Given
      const { result } = renderHook(() => useZoomTracking({ fabricCanvasRef }));
      
      // When
      const cleanup = result.current.registerZoomTracking();
      
      // Then
      expect(mockCanvas.on).toHaveBeenCalledWith('zoom:changed', expect.any(Function));
      
      // When zoom changes
      const zoomChangedHandler = (mockCanvas.on as ReturnType<typeof vi.fn>).mock.calls.find(
        call => call[0] === 'zoom:changed'
      )[1];
      zoomChangedHandler();
      
      // Then custom event is fired
      expect(mockCanvas.fire).toHaveBeenCalledWith('custom:zoom-changed', { zoom: 1 });
      
      // When cleaning up
      if (cleanup) cleanup();
      
      // Then event listener is removed
      expect(mockCanvas.off).toHaveBeenCalledWith('zoom:changed', expect.any(Function));
    });
  });

  describe('useCanvasHandlers', () => {
    test('should attach handlers to canvas object', () => {
      // When
      renderHook(() => useCanvasHandlers({
        fabricCanvasRef,
        tool: defaultTool, // Add the required tool property
        handleUndo: mockHandleUndo,
        handleRedo: mockHandleRedo,
        saveCurrentState: mockSaveCurrentState,
        deleteSelectedObjects: mockDeleteSelectedObjects
      }));
      
      // Then
      const enhancedCanvas = mockCanvas as any;
      expect(enhancedCanvas.handleUndo).toBe(mockHandleUndo);
      expect(enhancedCanvas.handleRedo).toBe(mockHandleRedo);
      expect(enhancedCanvas.saveCurrentState).toBe(mockSaveCurrentState);
      expect(enhancedCanvas.deleteSelectedObjects).toBe(mockDeleteSelectedObjects);
    });
    
    test('should clean up handlers on unmount', () => {
      // When
      const { unmount } = renderHook(() => useCanvasHandlers({
        fabricCanvasRef,
        tool: defaultTool, // Add the required tool property
        handleUndo: mockHandleUndo,
        handleRedo: mockHandleRedo,
        saveCurrentState: mockSaveCurrentState,
        deleteSelectedObjects: mockDeleteSelectedObjects
      }));
      
      unmount();
      
      // Then
      const enhancedCanvas = mockCanvas as any;
      expect(enhancedCanvas.handleUndo).toBeUndefined();
      expect(enhancedCanvas.handleRedo).toBeUndefined();
      expect(enhancedCanvas.saveCurrentState).toBeUndefined();
      expect(enhancedCanvas.deleteSelectedObjects).toBeUndefined();
    });
  });
});
