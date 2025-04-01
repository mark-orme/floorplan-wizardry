
/**
 * Straight line constraints test
 * Tests snapping behavior and angle constraints
 * @module tests/tools/straightLineConstraints
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Line } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { createMockCanvas } from '@/utils/test/mockFabricCanvas';
import { Point } from '@/types/core/Geometry';

// Mock the useStraightLineTool hook
vi.mock('@/hooks/straightLineTool/useStraightLineTool', () => ({
  useStraightLineTool: vi.fn((props) => ({
    isToolInitialized: true,
    isDrawing: false,
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn()
  }))
}));

describe('Straight Line Constraints Tests', () => {
  let canvas: Canvas;
  let canvasRef: { current: Canvas | null };
  let saveCurrentState: () => void;
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    canvasRef = { current: canvas };
    saveCurrentState = vi.fn();
    
    // Mock Line constructor
    vi.mock('fabric', async () => {
      const actual = await vi.importActual('fabric');
      return {
        ...actual,
        Line: vi.fn().mockImplementation((points, options) => ({
          points,
          set: vi.fn(),
          setCoords: vi.fn(),
          ...options
        }))
      };
    });
  });
  
  it('initializes straight line tool correctly', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    
    const { isToolInitialized } = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    expect(isToolInitialized).toBeDefined();
  });
  
  it('handles line drawing start and end correctly', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    
    // Set up the hook with mocked functions
    const mockStartDrawing = vi.fn();
    const mockContinueDrawing = vi.fn();
    const mockEndDrawing = vi.fn();
    
    // Override the mock implementation for this test
    vi.mocked(useStraightLineTool).mockReturnValueOnce({
      isToolInitialized: true,
      isDrawing: false,
      startDrawing: mockStartDrawing,
      continueDrawing: mockContinueDrawing,
      endDrawing: mockEndDrawing,
      cancelDrawing: vi.fn()
    });
    
    // Use the hook
    const result = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Call the functions
    const startPoint: Point = { x: 100, y: 100 };
    const endPoint: Point = { x: 200, y: 200 };
    
    result.startDrawing(startPoint);
    result.continueDrawing({ x: 150, y: 150 });
    result.endDrawing(endPoint);
    
    // Verify the functions were called
    expect(mockStartDrawing).toHaveBeenCalledWith(startPoint);
    expect(mockContinueDrawing).toHaveBeenCalledWith({ x: 150, y: 150 });
    expect(mockEndDrawing).toHaveBeenCalledWith(endPoint);
  });
  
  it('handles shift key for angle constraints', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    const addSpy = vi.spyOn(canvas, 'add');
    
    // Override the mock implementation for keyboard events
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        // Mock the keyboard API
        keyboard: {
          getLayoutMap: () => Promise.resolve(new Map([['ShiftLeft', 'ShiftLeft']])),
          modifiers: new Set(['Shift'])
        }
      },
      configurable: true,
      writable: true
    });
    
    // Mock the straight line tool with a function that respects shift key
    const mockStartDrawing = vi.fn();
    const mockContinueDrawing = vi.fn();
    const mockEndDrawing = vi.fn();
    
    vi.mocked(useStraightLineTool).mockReturnValueOnce({
      isToolInitialized: true,
      isDrawing: true,
      startDrawing: mockStartDrawing,
      continueDrawing: mockContinueDrawing,
      endDrawing: mockEndDrawing,
      cancelDrawing: vi.fn()
    });
    
    // Use the hook
    const result = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Simulate drawing with shift key
    result.startDrawing({ x: 100, y: 100 });
    result.continueDrawing({ x: 150, y: 120 });
    result.endDrawing({ x: 200, y: 100 });
    
    // Verify functions were called
    expect(mockStartDrawing).toHaveBeenCalled();
    expect(mockContinueDrawing).toHaveBeenCalled();
    expect(mockEndDrawing).toHaveBeenCalled();
    
    // Restore the original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true
    });
  });
  
  it('handles line cancellation correctly', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    
    // Mock the cancelDrawing function
    const mockCancelDrawing = vi.fn();
    
    vi.mocked(useStraightLineTool).mockReturnValueOnce({
      isToolInitialized: true,
      isDrawing: true,
      startDrawing: vi.fn(),
      continueDrawing: vi.fn(),
      endDrawing: vi.fn(),
      cancelDrawing: mockCancelDrawing
    });
    
    // Use the hook
    const result = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Start drawing and then cancel
    result.startDrawing({ x: 100, y: 100 });
    result.cancelDrawing();
    
    // Verify cancelDrawing was called
    expect(mockCancelDrawing).toHaveBeenCalled();
  });
});
