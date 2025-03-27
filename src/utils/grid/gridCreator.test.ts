
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createGridLayer, createFallbackGrid } from './gridCreator';
import logger from '../logger';

// Mock dependencies
vi.mock('../logger', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock gridManager
vi.mock('../gridManager', () => ({
  gridManager: {
    lastDimensions: null,
    exists: false,
    consecutiveResets: 0,
    creationInProgress: false
  },
  acquireGridCreationLock: vi.fn().mockReturnValue(true),
  releaseGridCreationLock: vi.fn()
}));

// Mock gridRenderer
vi.mock('../gridRenderer', () => ({
  renderGridComponents: vi.fn().mockReturnValue({
    gridObjects: [
      { id: 'smallGrid1', type: 'line' },
      { id: 'largeGrid1', type: 'line' },
      { id: 'marker1', type: 'text' }
    ],
    smallGridLines: [{ id: 'smallGrid1', type: 'line' }],
    largeGridLines: [{ id: 'largeGrid1', type: 'line' }],
    markers: [{ id: 'marker1', type: 'text' }]
  }),
  arrangeGridObjects: vi.fn()
}));

describe('Grid Creator', () => {
  let mockCanvas: any;
  let mockGridLayerRef: any;
  let mockSetDebugInfo: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock canvas
    mockCanvas = {
      width: 800,
      height: 600,
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      sendObjectToBack: vi.fn(),
      bringObjectToFront: vi.fn(),
      requestRenderAll: vi.fn()
    };
    
    // Create mock grid layer ref
    mockGridLayerRef = {
      current: []
    };
    
    // Create mock setDebugInfo function
    mockSetDebugInfo = vi.fn();
  });
  
  test('createGridLayer should create a grid successfully', () => {
    // When
    const result = createGridLayer(
      mockCanvas,
      mockGridLayerRef,
      { width: 800, height: 600 },
      mockSetDebugInfo
    );
    
    // Then
    expect(result.length).toBeGreaterThan(0);
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    expect(mockSetDebugInfo).toHaveBeenCalledWith(expect.objectContaining({ 
      gridCreated: true 
    }));
    
    // Check that grid objects are stored in the ref
    expect(mockGridLayerRef.current).toBe(result);
  });
  
  test('createGridLayer should clean up existing grid objects', () => {
    // Given
    const existingObjects = [
      { id: 'existing1', type: 'line' },
      { id: 'existing2', type: 'line' }
    ];
    mockGridLayerRef.current = existingObjects;
    
    // When
    createGridLayer(
      mockCanvas,
      mockGridLayerRef,
      { width: 800, height: 600 },
      mockSetDebugInfo
    );
    
    // Then
    expect(mockCanvas.remove).toHaveBeenCalledTimes(existingObjects.length);
  });
  
  test('createFallbackGrid should create a grid with hardcoded dimensions', () => {
    // When
    const result = createFallbackGrid(
      mockCanvas,
      mockGridLayerRef,
      mockSetDebugInfo
    );
    
    // Then
    expect(result.length).toBeGreaterThan(0);
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    expect(mockSetDebugInfo).toHaveBeenCalledWith(expect.objectContaining({ 
      gridCreated: true 
    }));
  });
  
  test('createGridLayer should handle failed grid creation', () => {
    // Given - mock renderGridComponents to return empty grid
    const renderGridComponentsMock = require('../gridRenderer').renderGridComponents;
    renderGridComponentsMock.mockReturnValueOnce({
      gridObjects: [],
      smallGridLines: [],
      largeGridLines: [],
      markers: []
    });
    
    // When
    const result = createGridLayer(
      mockCanvas,
      mockGridLayerRef,
      { width: 800, height: 600 },
      mockSetDebugInfo
    );
    
    // Then
    expect(result.length).toBe(0);
    expect(logger.warn).toHaveBeenCalled();
  });
});
