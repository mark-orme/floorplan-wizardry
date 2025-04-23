import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from '@/hooks/straightLineTool/useLineInputMethod';

/**
 * Creates a mock straight line tool for testing
 */
export function createMockStraightLineTool() {
  return {
    isActive: true,
    isEnabled: true,
    isToolInitialized: true,
    isDrawing: false,
    currentLine: null,
    snapEnabled: true,
    anglesEnabled: true,
    inputMethod: 'mouse' as InputMethod,
    isPencilMode: false,
    shiftKeyPressed: false,
    measurementData: {
      distance: null,
      angle: null,
      snapped: false,
      unit: 'm'
    },
    toggleGridSnapping: vi.fn(),
    toggleAngles: vi.fn(),
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn(),
    handlePointerDown: vi.fn(),
    handlePointerMove: vi.fn(),
    handlePointerUp: vi.fn(),
    handleKeyDown: vi.fn(),
    handleKeyUp: vi.fn(),
    renderTooltip: vi.fn(),
    setInputMethod: vi.fn(),
    setCurrentLine: vi.fn(),
    saveCurrentState: vi.fn()
  };
}

/**
 * Creates a mock floor plan for testing
 */
export function createMockFloorPlan() {
  return {
    id: 'mock-floor-plan-1',
    name: 'Mock Floor Plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    width: 800,
    height: 600,
    data: {}
  };
}

// Alias for backward compatibility
export const createEmptyFloorPlan = createMockFloorPlan;
