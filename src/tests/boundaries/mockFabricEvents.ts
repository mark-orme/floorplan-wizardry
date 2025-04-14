
/**
 * Mock Fabric.js event utilities for testing
 * These provide simplified versions of Fabric event interfaces
 * @module tests/boundaries/mockFabricEvents
 */
import { TPointerEventInfo, TPointerEvent, FabricEventNames } from '@/types/fabric-events';
import { Object as FabricObject } from 'fabric';
import { vi } from 'vitest';

/**
 * Create a mock pointer event object for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mocked pointer event info
 */
export function createMockPointerEvent(x: number, y: number): TPointerEventInfo<TPointerEvent> {
  return {
    e: {
      clientX: x,
      clientY: y,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as TPointerEvent,
    pointer: { x, y },
    absolutePointer: { x, y }
  };
}

/**
 * Create a mock selection event for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mocked selection event info with additional click properties
 */
export function createMockSelectionEvent(x: number, y: number) {
  return {
    ...createMockPointerEvent(x, y),
    isClick: true,
    currentTarget: null as unknown as FabricObject,
    currentSubTargets: [] as FabricObject[]
  };
}

/**
 * Create a mock canvas for testing
 */
export function createMockCanvas() {
  return {
    on: vi.fn().mockReturnThis(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    renderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    selection: true,
    contains: vi.fn().mockReturnValue(false)
  };
}
