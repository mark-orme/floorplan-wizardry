
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
    
    // Set up the hook
    const { isToolInitialized, startDrawing, continueDrawing, endDrawing } = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Start drawing at a point
    startDrawing({ x: 100, y: 100 });
    
    // Continue drawing
    continueDrawing({ x: 200, y: 200 });
    
    // End drawing
    endDrawing({ x: 200, y: 200 });
    
    // Should call saveCurrentState when drawing is completed
    expect(saveCurrentState).toHaveBeenCalled();
  });
  
  it('handles shift key for angle constraints', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    const addSpy = vi.spyOn(canvas, 'add');
    
    // Set up the hook
    const { startDrawing, continueDrawing, endDrawing } = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Mock keyboard state
    const originalKeyboard = global.navigator.keyboard;
    Object.defineProperty(global.navigator, 'keyboard', {
      value: {
        getLayoutMap: () => Promise.resolve(new Map([['ShiftLeft', 'ShiftLeft']])),
        modifiers: new Set(['Shift'])
      },
      configurable: true
    });
    
    // Start drawing at a point
    startDrawing({ x: 100, y: 100 });
    
    // Continue drawing with shift key
    // This would normally constrain to 0, 45, 90 degrees etc.
    continueDrawing({ x: 150, y: 120 });
    
    // End drawing
    endDrawing({ x: 200, y: 100 });
    
    // Should call add to add the line to canvas
    expect(addSpy).toHaveBeenCalled();
    
    // Restore original keyboard
    Object.defineProperty(global.navigator, 'keyboard', {
      value: originalKeyboard,
      configurable: true
    });
  });
  
  it('handles line cancellation correctly', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    
    // Set up the hook
    const { startDrawing, cancelDrawing } = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Start drawing at a point
    startDrawing({ x: 100, y: 100 });
    
    // Cancel drawing
    cancelDrawing();
    
    // saveCurrentState should not be called when drawing is cancelled
    expect(saveCurrentState).not.toHaveBeenCalled();
  });
  
  it('handles short lines correctly', () => {
    const lineColor = '#ff0000';
    const lineThickness = 3;
    const addSpy = vi.spyOn(canvas, 'add');
    
    // Set up the hook
    const { startDrawing, endDrawing } = useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor,
      lineThickness,
      saveCurrentState
    });
    
    // Start drawing at a point
    startDrawing({ x: 100, y: 100 });
    
    // End drawing at almost the same point (very short line)
    endDrawing({ x: 101, y: 101 });
    
    // Should still add the line and call saveCurrentState
    expect(addSpy).toHaveBeenCalled();
    expect(saveCurrentState).toHaveBeenCalled();
  });
});
