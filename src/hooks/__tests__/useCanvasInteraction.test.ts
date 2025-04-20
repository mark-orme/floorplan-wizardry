
// Update test imports and implement test
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCanvasInteraction } from '../useCanvasInteraction';
import { DrawingMode } from '@/constants/drawingModes';

describe('useCanvasInteraction', () => {
  let mockCanvas: any;
  let mockCanvasRef: any;
  let saveCurrentState: any;

  beforeEach(() => {
    mockCanvas = {
      isDrawingMode: false,
      selection: true,
      getActiveObjects: vi.fn().mockReturnValue([]),
      remove: vi.fn(),
      discardActiveObject: vi.fn(),
      requestRenderAll: vi.fn(),
      forEachObject: vi.fn(),
      off: vi.fn()
    };
    
    mockCanvasRef = { current: mockCanvas };
    saveCurrentState = vi.fn();
  });

  test('setupSelectionMode with SELECT tool should enable point selection', () => {
    const { setupSelectionMode } = useCanvasInteraction({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    });

    setupSelectionMode();

    expect(mockCanvas.isDrawingMode).toBe(false);
    expect(mockCanvas.forEachObject).toHaveBeenCalled();
  });

  test('setupSelectionMode with DRAW tool should enable drawing mode', () => {
    const { setupSelectionMode } = useCanvasInteraction({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.DRAW,
      saveCurrentState
    });

    setupSelectionMode();

    expect(mockCanvas.isDrawingMode).toBe(true);
    expect(mockCanvas.selection).toBe(false);
    expect(mockCanvas.forEachObject).toHaveBeenCalled();
  });

  test('deleteSelectedObjects should remove selected objects', () => {
    const activeObjects = [{ id: 'obj1' }, { id: 'obj2' }];
    mockCanvas.getActiveObjects.mockReturnValue(activeObjects);

    const { deleteSelectedObjects } = useCanvasInteraction({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    });

    deleteSelectedObjects();

    expect(saveCurrentState).toHaveBeenCalled();
    expect(mockCanvas.remove).toHaveBeenCalledWith(...activeObjects);
    expect(mockCanvas.discardActiveObject).toHaveBeenCalled();
  });

  test('deleteSelectedObjects should not do anything if canvas is null', () => {
    const nullCanvasRef = { current: null };
    
    const { deleteSelectedObjects } = useCanvasInteraction({
      fabricCanvasRef: nullCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    });

    deleteSelectedObjects();

    expect(saveCurrentState).not.toHaveBeenCalled();
  });

  test('enablePointSelection should set up point selection', () => {
    const { enablePointSelection } = useCanvasInteraction({
      fabricCanvasRef: mockCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    });

    enablePointSelection();

    expect(mockCanvas.selection).toBe(false);
    expect(mockCanvas.forEachObject).toHaveBeenCalled();
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
  });
});
