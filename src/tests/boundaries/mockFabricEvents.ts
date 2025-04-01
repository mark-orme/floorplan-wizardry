
/**
 * Mock Fabric.js event utilities for testing
 * These provide simplified versions of Fabric event interfaces
 * @module tests/boundaries/mockFabricEvents
 */
import { TPointerEventInfo, TPointerEvent } from '@/types/fabric-events';

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
    absolutePointer: { x, y },
    scenePoint: { x, y },
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
  return {
    ...createMockPointerEvent(x, y),
    isClick: true,
    currentTarget: null,
    currentSubTargets: []
  };
}
