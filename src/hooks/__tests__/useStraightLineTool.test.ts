import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mocked } from 'jest-mock';
import { renderHook } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../tools/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { createMockCanvas } from '@/utils/test/createMockCanvas';

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
    mockCanvas = createMockCanvas();
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
  
  it('should add a line when mouse up event is triggered at a sufficient distance', () => {
    // Setup
    const mockedCanvas = createMockCanvas();
    const mockedAdd = mocked(mockedCanvas.add);
    const { result } = renderHook(() => 
      useStraightLineTool({
        isActive: true,
        canvas: mockedCanvas as unknown as Canvas,
        saveCurrentState: saveStateMock
      })
    );
    
    // Find the event handler that was registered
    const mouseUpHandler = vi.mocked(mockedCanvas.on).mock.calls.find(
      call => call[0] === 'mouse:up'
    )?.[1] as ((e: MockEvent) => void) | undefined;
    
    expect(mouseUpHandler).toBeDefined();
    
    // Simulate mouse up event
    if (mouseUpHandler) {
      const mockEvent: MockEvent = {
        e: { clientX: 100, clientY: 100, button: 0, shiftKey: false },
        pointer: { x: 100, y: 100 }
      };
      
      act(() => {
        mouseUpHandler(mockEvent);
      });
      
      // The tool should now have added a line
      expect(mockedAdd).toHaveBeenCalled();
    }
  });
});
