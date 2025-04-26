
import { vi } from 'vitest';
import { MockCanvasType, IEnhancedMockCanvas } from '@/types/mock/MockCanvasTypes';
import { Canvas as FabricCanvas } from 'fabric';

export function createTestCanvas(): MockCanvasType {
  const mockCanvas: IEnhancedMockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    withImplementation: vi.fn().mockImplementation((callback?: Function) => {
      if (callback) {
        try {
          callback();
        } catch (e) {
          console.error(e);
        }
      }
      return Promise.resolve();
    }),
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: (eventName: string) => [() => {}],
    triggerEvent: (eventName: string, eventData: any) => {}
  };

  return mockCanvas as unknown as MockCanvasType;
}

export function assertMockCanvas(canvas: any): MockCanvasType {
  if (!canvas) {
    throw new Error('Canvas is null or undefined');
  }
  return canvas as MockCanvasType;
}
