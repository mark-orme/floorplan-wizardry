
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
  
  // Critical fix: Ensure withImplementation returns Promise<void>
  withImplementation?: (impl: Function) => Promise<void>;

  // Add proper typing for performance monitoring
  __lastRenderTime?: number;
}

/**
 * Create a minimal canvas mock for testing
 * @returns A canvas mock that implements ICanvasMock
 */
export function createMinimalCanvasMock(): ICanvasMock {
  const mockCanvas: ICanvasMock = {
    getObjects: vi.fn().mockReturnValue([]),
    remove: vi.fn().mockReturnThis(),
    add: vi.fn().mockReturnThis(),
    requestRenderAll: vi.fn(),
    renderAll: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    selection: true,
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    getPointerCoords: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    getClass: vi.fn(),
    sendToBack: vi.fn().mockReturnThis(),
    sendObjectToBack: vi.fn().mockReturnThis(),
    bringToFront: vi.fn().mockReturnThis(),
    bringObjectToFront: vi.fn().mockReturnThis(),
    getActiveObject: vi.fn().mockReturnValue(null),
    setActiveObject: vi.fn().mockReturnThis(),
    discardActiveObject: vi.fn().mockReturnThis(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setZoom: vi.fn().mockReturnThis(),
    getZoom: vi.fn().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    // Fixed: Ensure implementation returns Promise<void>
    withImplementation: vi.fn().mockImplementation(() => Promise.resolve()),
    __lastRenderTime: Date.now(),
    
    // Add Supabase query mock methods
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis()
  };
  
  return mockCanvas;
}
