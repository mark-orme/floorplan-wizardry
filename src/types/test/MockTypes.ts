
/**
 * Implementation of mock type utilities
 * @module types/test/MockTypes
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { IMockCanvas } from './MockTypes.d';
import { vi } from 'vitest';

/**
 * Helper function to properly type a mock Canvas object
 * @param mockCanvas The mock canvas object to be typed as Canvas
 * @returns The same object typed as Canvas
 */
export function asMockCanvas<T>(mockCanvas: T): Canvas {
  const completeCanvas = {
    ...mockCanvas,
    // Adding missing critical internal properties
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    
    // Additional mock implementations for missing methods
    isDragging: false,
    _setupCurrentTransform: vi.fn(),
    _renderOverlay: vi.fn(),
    _restoreObjectsState: vi.fn(),
    _setStageDimension: vi.fn(),
    
    // Ensure all critical Fabric.js canvas methods are mocked
    fire: vi.fn(),
    calcOffset: vi.fn(),
    findTarget: vi.fn(),
    getSelectionContext: vi.fn(),
    getSelectionElement: vi.fn(),
    getActiveObject: vi.fn().mockReturnValue(null),
    setActiveObject: vi.fn(),
    
    // Internal properties often used by Fabric.js
    _objects: [],
    _activeObject: null,
    _groupSelector: null,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    
    // Cursor-related properties
    defaultCursor: 'default',
    hoverCursor: 'pointer',
    moveCursor: 'move'
  } as unknown as Canvas;
  
  return completeCanvas;
}

