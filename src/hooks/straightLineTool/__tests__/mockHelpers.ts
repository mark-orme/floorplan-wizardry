
import { vi } from 'vitest';
import { Point } from '@/types/core/Point';

/**
 * Mock the useLineState hook for tests
 */
export const mockLineState = () => ({
  isDrawing: false,
  startPoint: { x: 0, y: 0 } as Point | null,
  currentPoint: { x: 0, y: 0 } as Point | null,
  toggleSnap: vi.fn(),
  toggleAngles: vi.fn(),
  toggleGridSnapping: vi.fn(),
  measurementData: { 
    startPoint: { x: 0, y: 0 }, 
    endPoint: { x: 0, y: 0 }, 
    distance: 0, 
    angle: 0, 
    midPoint: { x: 0, y: 0 }, 
    unit: 'px', 
    pixelsPerMeter: 100 
  },
  setIsDrawing: vi.fn(),
  setStartPoint: vi.fn(),
  setCurrentPoint: vi.fn(),
  startDrawing: vi.fn(),
  continueDrawing: vi.fn(),
  completeDrawing: vi.fn(),
  cancelDrawing: vi.fn(),
  snapEnabled: true,
  anglesEnabled: true,
  // Add missing test properties
  handleMouseDown: vi.fn(),
  handleMouseMove: vi.fn(),
  handleMouseUp: vi.fn()
});

// Mock canvas creator
export const createMockCanvas = () => ({
  add: vi.fn(),
  remove: vi.fn(),
  renderAll: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  getPointer: vi.fn(),
  contains: vi.fn().mockReturnValue(true),
  getObjects: vi.fn().mockReturnValue([])
});

// Mock line creator
export const createMockLine = () => ({
  set: vi.fn(),
  setCoords: vi.fn()
});
