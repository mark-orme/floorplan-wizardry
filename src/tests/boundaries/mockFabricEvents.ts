
/**
 * Mock Fabric.js event utilities for testing
 * These provide simplified versions of Fabric event interfaces
 * @module tests/boundaries/mockFabricEvents
 */
import { TPointerEventInfo, TPointerEvent, FabricEventNames } from '@/types/fabric-events';
import { Object as FabricObject } from 'fabric';
import { vi } from 'vitest';
import { createMockObject } from '@/utils/test/mockFabricCanvas';

/**
 * Create a mock pointer event object for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mocked pointer event info
 */
export function createMockPointerEvent(x: number, y: number): TPointerEventInfo<TPointerEvent> {
  const mockEvent: TPointerEvent = {
    clientX: x,
    clientY: y,
    preventDefault: () => {},
    stopPropagation: () => {}
  } as TPointerEvent;
  
  return {
    e: mockEvent,
    pointer: { x, y },
    absolutePointer: { x, y },
    viewportPoint: { x, y }
  };
}

/**
 * Create a mock selection event for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mocked selection event info with additional click properties
 */
export function createMockSelectionEvent(x: number, y: number) {
  const baseEvent = createMockPointerEvent(x, y);
  return {
    ...baseEvent,
    isClick: true,
    currentTarget: null as FabricObject | null,
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

/**
 * Create mock fabric objects with specific behaviors for testing
 * @param type Object type
 * @param props Object properties
 * @returns Mock fabric object
 */
export function createMockFabricObject(type: string, props: Record<string, unknown> = {}) {
  return createMockObject(type, props);
}

/**
 * Create a straight line mock for testing line operations
 * @param x1 Start X
 * @param y1 Start Y
 * @param x2 End X
 * @param y2 End Y
 * @param props Additional properties
 * @returns Mock line object
 */
export function createMockLine(
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  props: Record<string, unknown> = {}
) {
  return createMockObject('line', {
    x1, y1, x2, y2,
    ...props
  });
}
