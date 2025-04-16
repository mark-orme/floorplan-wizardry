
/**
 * Implementation of mock type utilities
 * @module types/test/MockTypes
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { IMockCanvas, IMockObject } from './MockTypes.d';
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

/**
 * Helper function to properly type a mock Fabric object
 * @param mockObject The mock object to be typed as FabricObject
 * @returns The same object typed as FabricObject
 */
export function asMockObject<T>(mockObject: T): FabricObject {
  const completeObject = {
    ...mockObject,
    // Default properties required for Fabric objects
    visible: true,
    evented: true,
    selectable: true,
    hasBorders: true,
    hasControls: true,
    hasRotatingPoint: true,
    transparentCorners: true,
    // Add mock methods required by tests
    setCoords: vi.fn(),
    _set: vi.fn(),
    _render: vi.fn(),
    _findCenterFromElement: vi.fn(),
    _setWidthHeight: vi.fn()
  } as unknown as FabricObject;
  
  return completeObject;
}
