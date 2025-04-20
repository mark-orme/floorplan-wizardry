
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
  
  // Additional properties required by some tests
  sendToBack?: (obj: FabricObject) => ICanvasMock;
  sendObjectToBack?: (obj: FabricObject) => ICanvasMock;
  bringToFront?: (obj: FabricObject) => ICanvasMock;
  bringObjectToFront?: (obj: FabricObject) => ICanvasMock;
  getActiveObject?: () => FabricObject | null;
  setActiveObject?: (obj: FabricObject) => ICanvasMock;
  discardActiveObject?: () => ICanvasMock;
  getWidth?: () => number;
  getHeight?: () => number;
  setZoom?: (zoom: number) => ICanvasMock;
  getZoom?: () => number;
  viewportTransform?: number[];
  
  // For type compatibility
  [key: string]: any;
  
  // For vitest mocks
  withImplementation?: (impl: Function) => Promise<void>;
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
    getClass: jest.fn<any, []>(),
    sendToBack: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    sendObjectToBack: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    bringToFront: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    bringObjectToFront: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    getActiveObject: jest.fn<FabricObject | null, []>().mockReturnValue(null),
    setActiveObject: jest.fn<ICanvasMock, [FabricObject]>().mockReturnThis(),
    discardActiveObject: jest.fn<ICanvasMock, []>().mockReturnThis(),
    getWidth: jest.fn<number, []>().mockReturnValue(800),
    getHeight: jest.fn<number, []>().mockReturnValue(600),
    setZoom: jest.fn<ICanvasMock, [number]>().mockReturnThis(),
    getZoom: jest.fn<number, []>().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    withImplementation: jest.fn<Promise<void>, [Function]>().mockResolvedValue(undefined)
  };
}
