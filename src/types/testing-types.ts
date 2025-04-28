
import { Canvas, Object as FabricObject } from 'fabric';

export interface MockCanvas extends Canvas {
  isDrawingMode: boolean;
  selection: boolean;
  add: jest.Mock;
  remove: jest.Mock;
  renderAll: jest.Mock;
  discardActiveObject: jest.Mock;
  getObjects: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  getActiveObjects: jest.Mock;
  requestRenderAll: jest.Mock;
  setActiveObject: jest.Mock;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  forEachObject: jest.Mock;
}

export const createMockCanvas = (): MockCanvas => {
  return {
    isDrawingMode: false,
    selection: true,
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    add: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    renderAll: jest.fn().mockReturnThis(),
    requestRenderAll: jest.fn().mockReturnThis(),
    discardActiveObject: jest.fn().mockReturnThis(),
    getObjects: jest.fn().mockReturnValue([]),
    getActiveObjects: jest.fn().mockReturnValue([]),
    on: jest.fn().mockReturnThis(),
    off: jest.fn().mockReturnThis(),
    setActiveObject: jest.fn().mockReturnThis(),
    forEachObject: jest.fn((callback) => {
      const objects: FabricObject[] = [];
      objects.forEach(callback);
    })
  } as unknown as MockCanvas;
};
