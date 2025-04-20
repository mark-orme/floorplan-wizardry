
/**
 * Simplified Canvas interface for testing
 * Contains only the methods needed for testing, reducing type errors
 * @module types/testing/ICanvasMock
 */
import { Object as FabricObject } from 'fabric';

/**
 * Interface for a minimal canvas mock in tests
 * Only includes methods that are actually used in tests
 */
export interface ICanvasMock {
  // Common methods used in tests
  getObjects(): FabricObject[];
  remove(obj: FabricObject): ICanvasMock;
  add(...objects: FabricObject[]): ICanvasMock;
  requestRenderAll(): void;
  renderAll(): void;
  
  // Optional properties
  isDrawingMode?: boolean;
  freeDrawingBrush?: {
    color: string;
    width: number;
  };
  selection?: boolean;
  on?(eventName: string, handler: Function): ICanvasMock;
  off?(eventName: string, handler?: Function): ICanvasMock;
  
  // For type compatibility with useDrawingHistory
  getPointerCoords?: () => { x: number, y: number };
  
  // For type compatibility
  [key: string]: any;
}

/**
 * Create a minimal canvas mock for testing
 * @returns A canvas mock that implements ICanvasMock
 */
export function createMinimalCanvasMock(): ICanvasMock {
  return {
    getObjects: jest.fn<FabricObject[], []>().mockReturnValue([]),
    remove: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    add: jest.fn<ICanvasMock, FabricObject[]>().mockReturnThis(),
    requestRenderAll: jest.fn<void, []>(),
    renderAll: jest.fn<void, []>(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    selection: true,
    on: jest.fn<ICanvasMock, [string, Function]>().mockReturnThis(),
    off: jest.fn<ICanvasMock, [string, Function?]>().mockReturnThis(),
    getPointerCoords: jest.fn<{ x: number, y: number }, []>().mockReturnValue({ x: 0, y: 0 }),
    getClass: jest.fn<any, []>()
  };
}
