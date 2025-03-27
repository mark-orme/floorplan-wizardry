
/**
 * Tests for canvas input handling functionality
 * @module tests/canvas/inputHandling
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeDrawingBrush, addPressureSensitivity } from '@/utils/fabricBrush';

// Define strongly typed mocks to avoid TypeScript errors
interface MockCanvas {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  fire?: ReturnType<typeof vi.fn>;
}

interface MockEvent {
  e: {
    preventDefault: ReturnType<typeof vi.fn>;
    touches?: Array<{
      force?: number;
      clientX: number;
      clientY: number;
    }>;
  };
}

// Mock fabric
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      freeDrawingBrush: {
        color: "#000000",
        width: 2
      }
    } as MockCanvas)),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: "#000000",
      width: 2
    }))
  };
});

describe('Canvas Input Handling', () => {
  let mockCanvas: MockCanvas;
  
  beforeEach(() => {
    mockCanvas = {
      on: vi.fn(),
      off: vi.fn(),
      freeDrawingBrush: {
        color: "#000000",
        width: 2
      },
      fire: vi.fn()
    };
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  test('initializes the drawing brush correctly', () => {
    // Given a mock canvas
    
    // When initializing the brush
    initializeDrawingBrush(mockCanvas as any);
    
    // Then the brush should be configured correctly
    expect(mockCanvas.freeDrawingBrush).toBeDefined();
    expect(mockCanvas.freeDrawingBrush.width).toBe(2);
    expect(mockCanvas.freeDrawingBrush.color).toBe("#000000");
  });
  
  test('adds pressure sensitivity handling', () => {
    // When adding pressure sensitivity
    addPressureSensitivity(mockCanvas as any);
    
    // Then event handlers should be registered
    expect(mockCanvas.on).toHaveBeenCalledTimes(2);
    expect(mockCanvas.on).toHaveBeenCalledWith('mouse:down', expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith('mouse:up', expect.any(Function));
  });
  
  test('handles mouse input correctly', () => {
    // Given a mock canvas with pressure sensitivity
    addPressureSensitivity(mockCanvas as any);
    
    // When triggering the mouse:down handler
    const mouseDownHandler = mockCanvas.on.mock.calls.find(
      call => call[0] === 'mouse:down'
    )[1];
    
    // With a mouse event (no pressure)
    const mockMouseEvent: MockEvent = {
      e: {
        preventDefault: vi.fn(),
      }
    };
    
    mouseDownHandler(mockMouseEvent);
    
    // Then brush width should remain at default
    expect(mockCanvas.freeDrawingBrush.width).toBe(2);
  });
  
  test('handles stylus pressure correctly', () => {
    // Given a mock canvas with pressure sensitivity
    addPressureSensitivity(mockCanvas as any);
    
    // When triggering the mouse:down handler
    const mouseDownHandler = mockCanvas.on.mock.calls.find(
      call => call[0] === 'mouse:down'
    )[1];
    
    // With a touch event with pressure
    const mockTouchEvent: MockEvent = {
      e: {
        preventDefault: vi.fn(),
        touches: [{ force: 0.5, clientX: 100, clientY: 100 }]
      }
    };
    
    mouseDownHandler(mockTouchEvent);
    
    // Then brush width should be adjusted by pressure
    expect(mockCanvas.freeDrawingBrush.width).toBe(1); // 2 * 0.5 = 1
  });
  
  test('handles touch events without pressure', () => {
    // Given a mock canvas with pressure sensitivity
    addPressureSensitivity(mockCanvas as any);
    
    // When triggering the mouse:down handler
    const mouseDownHandler = mockCanvas.on.mock.calls.find(
      call => call[0] === 'mouse:down'
    )[1];
    
    // With a touch event without pressure
    const mockTouchEvent: MockEvent = {
      e: {
        preventDefault: vi.fn(),
        touches: [{ clientX: 100, clientY: 100 }]
      }
    };
    
    mouseDownHandler(mockTouchEvent);
    
    // Then brush width should remain at default
    expect(mockCanvas.freeDrawingBrush.width).toBe(2);
  });
});
