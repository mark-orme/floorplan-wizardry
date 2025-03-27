
/**
 * Tests for grid debugging utilities
 * @module gridDebugUtils.test
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { dumpGridState, attemptGridRecovery, forceCreateGrid } from './gridDebugUtils';
import { createBasicEmergencyGrid } from '../gridCreationUtils';
import { toast } from 'sonner';
import logger from '../logger';

// Mock dependencies
vi.mock('../logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('../gridCreationUtils', () => ({
  createBasicEmergencyGrid: vi.fn().mockImplementation((canvas, gridLayerRef) => {
    const objects = [
      { id: 'grid1', type: 'line' },
      { id: 'grid2', type: 'line' }
    ];
    
    // Update the gridLayerRef to simulate real behavior
    if (gridLayerRef) {
      gridLayerRef.current = objects;
    }
    
    return objects;
  })
}));

describe('Grid Debug Utilities', () => {
  let mockCanvas: any;
  let mockGridLayerRef: any;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Create mock canvas
    mockCanvas = {
      width: 800,
      height: 600,
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      getZoom: vi.fn().mockReturnValue(1),
      getElement: vi.fn().mockReturnValue({ clientWidth: 800, clientHeight: 600 }),
      getObjects: vi.fn().mockReturnValue([]),
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      sendToBack: vi.fn(),
      isDrawingMode: false,
      requestRenderAll: vi.fn(),
      setWidth: vi.fn(),
      setHeight: vi.fn()
    };
    
    // Create mock grid layer ref
    mockGridLayerRef = {
      current: [
        { type: 'line', visible: true, selectable: false, stroke: '#e0e0e0', id: 'grid1' },
        { type: 'line', visible: true, selectable: false, stroke: '#d0d0d0', id: 'grid2' }
      ]
    };
  });
  
  test('dumpGridState logs grid and canvas information', () => {
    // When
    dumpGridState(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(consoleLogSpy).toHaveBeenCalled();
    
    // Should log canvas dimensions
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("===== GRID DEBUG INFO ====="));
    expect(consoleLogSpy).toHaveBeenCalledWith("Canvas dimensions:", expect.any(Object));
    
    // Should log grid objects info
    expect(consoleLogSpy).toHaveBeenCalledWith("Grid objects:", expect.any(Object));
  });
  
  test('dumpGridState handles null canvas', () => {
    // When
    dumpGridState(null, mockGridLayerRef);
    
    // Then
    expect(consoleLogSpy).toHaveBeenCalledWith("Canvas: NULL");
  });
  
  test('dumpGridState handles null gridLayerRef', () => {
    // When
    dumpGridState(mockCanvas, null);
    
    // Then
    expect(consoleLogSpy).toHaveBeenCalledWith("Grid layer reference: NULL");
  });
  
  test('attemptGridRecovery creates emergency grid when creation function fails', () => {
    // Given
    const mockCreateGridFn = vi.fn().mockReturnValue([]);
    
    // When
    const result = attemptGridRecovery(mockCanvas, mockGridLayerRef, mockCreateGridFn);
    
    // Then
    expect(mockCreateGridFn).toHaveBeenCalledWith(mockCanvas);
    expect(createBasicEmergencyGrid).toHaveBeenCalledWith(mockCanvas, mockGridLayerRef);
    expect(result).toBe(true);
    expect(toast.success).toHaveBeenCalled();
  });
  
  test('attemptGridRecovery handles null canvas', () => {
    // When
    const result = attemptGridRecovery(null, mockGridLayerRef);
    
    // Then
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });
  
  test('forceCreateGrid creates emergency grid directly', () => {
    // When
    const result = forceCreateGrid(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(createBasicEmergencyGrid).toHaveBeenCalledWith(mockCanvas, mockGridLayerRef);
    expect(result).toBe(true);
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });
  
  test('forceCreateGrid handles canvas with zero dimensions', () => {
    // Given
    mockCanvas.width = 0;
    mockCanvas.height = 0;
    mockCanvas.getWidth.mockReturnValue(0);
    mockCanvas.getHeight.mockReturnValue(0);
    
    // When
    forceCreateGrid(mockCanvas, mockGridLayerRef);
    
    // Then
    expect(mockCanvas.setWidth).toHaveBeenCalled();
    expect(mockCanvas.setHeight).toHaveBeenCalled();
  });
  
  test('forceCreateGrid handles null canvas', () => {
    // When
    const result = forceCreateGrid(null, mockGridLayerRef);
    
    // Then
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
