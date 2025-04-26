import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Mock } from 'vitest';

export interface IMockCanvasBase {
  on: Mock;
  off: Mock;
  add: Mock;
  remove: Mock;
  getObjects: Mock;
  renderAll: Mock;
  requestRenderAll: Mock;
  getActiveObjects: Mock;
  discardActiveObject: Mock;
  contains: Mock;
  withImplementation: Mock<[callback?: Function], Promise<void>>;
  enablePointerEvents: boolean;
  _willAddMouseDown: boolean;
  _dropTarget: any;
  _isClick: boolean;
  _objects: any[];
}

export interface IEnhancedMockCanvas extends IMockCanvasBase {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
}

export type MockCanvasType = FabricCanvas & IEnhancedMockCanvas;

export function createEnhancedMockCanvas(): MockCanvasType {
  return {
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
  } as MockCanvasType;
}
