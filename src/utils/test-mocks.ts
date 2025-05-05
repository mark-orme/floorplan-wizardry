
import { vi } from 'vitest';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { FixMe } from '@/types/typesMap';

/**
 * Mock line state for tests
 */
export const mockLineState = () => ({
  isDrawing: false,
  startPoint: { x: 10, y: 10 },
  currentPoint: { x: 20, y: 20 },
  toggleSnap: vi.fn(),
  toggleAngles: vi.fn(),
  toggleGridSnapping: vi.fn(),
  measurementData: { 
    startPoint: { x: 10, y: 10 }, 
    endPoint: { x: 20, y: 20 }, 
    distance: 10, 
    angle: 45, 
    midPoint: { x: 15, y: 15 }, 
    unit: 'px', 
    pixelsPerMeter: 100 
  },
  startDrawing: vi.fn(),
  continueDrawing: vi.fn(),
  completeDrawing: vi.fn(),
  cancelDrawing: vi.fn(),
  snapEnabled: true,
  anglesEnabled: true,
  isActive: true,
  handleMouseDown: vi.fn(),
  handleMouseMove: vi.fn(),
  handleMouseUp: vi.fn(),
  renderTooltip: vi.fn().mockReturnValue(null)
});

/**
 * Mock drawing context for tests
 */
export const mockDrawingContext = {
  tool: DrawingMode.LINE,
  setTool: vi.fn(),
  lineColor: '#000000',
  setLineColor: vi.fn(),
  lineThickness: 2,
  setLineThickness: vi.fn(),
  showGrid: true,
  setShowGrid: vi.fn(),
  canUndo: false,
  canRedo: false,
  setCanUndo: vi.fn(),
  setCanRedo: vi.fn(),
  addToUndoStack: vi.fn()
};

/**
 * Mock canvas for tests
 */
export const mockCanvas = () => ({
  add: vi.fn(),
  remove: vi.fn(),
  renderAll: vi.fn(),
  requestRenderAll: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
  wrapperEl: document.createElement('div'),
  getObjects: vi.fn().mockReturnValue([]),
  getWidth: vi.fn().mockReturnValue(800),
  getHeight: vi.fn().mockReturnValue(600),
  contains: vi.fn().mockReturnValue(true),
  setActiveObject: vi.fn(),
  discardActiveObject: vi.fn()
});

/**
 * Mock point for tests
 */
export const mockPoint = (x: number = 0, y: number = 0): Point => ({ x, y });
