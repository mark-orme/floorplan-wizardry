
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../straightLineTool/useStraightLineTool';
import { Point } from '@/types/core/Point';
import { MockCanvas } from '@/utils/test/createMockCanvas';
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Create strongly typed mocks
interface MockEvent {
  e: {
    clientX: number;
    clientY: number;
    button: number;
    shiftKey: boolean;
  };
  pointer: Point;
  target?: FabricObject;
}

describe('useStraightLineTool', () => {
  let mockCanvas: MockCanvas;
  let saveStateMock: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    mockCanvas = {
      on: vi.fn(),
      off: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      getActiveObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      selection: true
    } as MockCanvas;
    
    saveStateMock = vi.fn();
  });
  
  it('enables the tool when isActive is true', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({
        isActive: true,
        canvas: mockCanvas as unknown as Canvas,
        saveCurrentState: saveStateMock
      })
    );
    
    expect(result.current.isEnabled).toBe(true);
    expect(mockCanvas.on).toHaveBeenCalledWith('mouse:down', expect.any(Function));
  });
  
  it('disables the tool when isActive is false', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({
        isActive: false,
        canvas: mockCanvas as unknown as Canvas, 
        saveCurrentState: saveStateMock
      })
    );
    
    expect(result.current.isEnabled).toBe(false);
    expect(mockCanvas.on).not.toHaveBeenCalled();
  });
  
  it('handles mouse down event to start drawing', () => {
    const { result } = renderHook(() => 
      useStraightLineTool({
        isActive: true,
        canvas: mockCanvas as unknown as Canvas,
        saveCurrentState: saveStateMock
      })
    );
    
    // Find the event handler that was registered
    const mouseDownHandler = vi.mocked(mockCanvas.on).mock.calls.find(
      call => call[0] === 'mouse:down'
    )?.[1] as ((e: MockEvent) => void) | undefined;
    
    expect(mouseDownHandler).toBeDefined();
    
    // Simulate mouse down event
    if (mouseDownHandler) {
      const mockEvent: MockEvent = {
        e: { clientX: 50, clientY: 50, button: 0, shiftKey: false },
        pointer: { x: 50, y: 50 }
      };
      
      act(() => {
        mouseDownHandler(mockEvent);
      });
      
      // The tool should now be in drawing state
      expect(result.current.isDrawing).toBe(true);
      expect(mockCanvas.selection).toBe(false);
    }
  });
});
