import { renderHook, act } from '@testing-library/react';
import { useCanvasInteraction } from '../useCanvasInteraction';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMockCanvas, createMockObject } from '@/tests/utils/canvasTestUtils';
import type { FabricCanvas } from '@/types/fabric';

describe('useCanvasInteraction', () => {
  let mockCanvas: FabricCanvas;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas = createMockCanvas();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should register object selection handler', () => {
    // Arrange
    const canvasRef = { current: mockCanvas };
    const handleSelect = vi.fn();
    
    // Act
    renderHook(() => useCanvasInteraction(canvasRef, { onSelect: handleSelect }));
    
    // Assert
    expect(mockCanvas.on).toHaveBeenCalledWith('selection:created', expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith('selection:updated', expect.any(Function));
  });
  
  it('should handle object selection events', () => {
    // Arrange
    const canvasRef = { current: mockCanvas };
    const handleSelect = vi.fn();
    
    // Create mock objects
    const mockRect = createMockObject('rect', { id: 'rect1' });
    const mockGrid = createMockObject('line', { objectType: 'grid', id: 'grid1' });
    
    const getActiveObjectsSpy = vi.fn().mockReturnValue([mockRect]);
    mockCanvas.getActiveObjects = getActiveObjectsSpy;
    
    // Act
    renderHook(() => useCanvasInteraction(canvasRef, { onSelect: handleSelect }));
    
    // Find the selection:created handler
    const selectionCreatedHandler = vi.mocked(mockCanvas.on).mock.calls
      .find(call => call[0] === 'selection:created')?.[1];
    
    if (selectionCreatedHandler) {
      // Trigger the handler manually
      selectionCreatedHandler({ target: mockRect });
      
      // Assert
      expect(handleSelect).toHaveBeenCalledWith([mockRect]);
    }
  });
  
  it('should not call selection handler for grid objects', () => {
    // Arrange
    const canvasRef = { current: mockCanvas };
    const handleSelect = vi.fn();
    
    // Create mock grid object that shouldn't trigger selection
    const mockGrid = createMockObject('line', { objectType: 'grid', id: 'grid1' });
    
    const getActiveObjectsSpy = vi.fn().mockReturnValue([mockGrid]);
    mockCanvas.getActiveObjects = getActiveObjectsSpy;
    
    // Act
    renderHook(() => useCanvasInteraction(canvasRef, { onSelect: handleSelect }));
    
    // Find the selection:created handler
    const selectionCreatedHandler = vi.mocked(mockCanvas.on).mock.calls
      .find(call => call[0] === 'selection:created')?.[1];
    
    if (selectionCreatedHandler) {
      // Trigger the handler manually
      selectionCreatedHandler({ target: mockGrid });
      
      // Assert that handler wasn't called for grid objects
      expect(handleSelect).not.toHaveBeenCalled();
    }
  });
  
  // Add more tests for other canvas interactions...
});
