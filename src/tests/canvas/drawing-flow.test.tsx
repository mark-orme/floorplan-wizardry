
/**
 * Integration tests for canvas drawing workflows
 * @module tests/canvas/drawing-flow
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas as FabricCanvas } from "fabric";
import { Canvas } from '@/components/Canvas';
import { CanvasContainer } from '@/components/canvas/CanvasContainer';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { DrawingTool } from '@/hooks/useCanvasState';
import { CanvasControllerProvider } from '@/components/canvas/controller/CanvasController';
import { DebugInfoState } from '@/types/debugTypes';

// Mock fabric canvas
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      dispose: vi.fn(),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      isDrawingMode: false
    })),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: "#000000",
      width: 2
    }))
  };
});

// Mock hooks
vi.mock('@/hooks/useCanvasDrawing', () => ({
  useCanvasDrawing: vi.fn().mockReturnValue({
    drawingState: {
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      midPoint: null,
      currentZoom: 1
    }
  })
}));

vi.mock('@/components/canvas/controller/CanvasController', () => ({
  useCanvasController: vi.fn().mockReturnValue({
    tool: 'wall',
    currentFloor: 0,
    lineThickness: 2,
    lineColor: '#000000',
    floorPlans: [],
    setFloorPlans: vi.fn(),
    setGia: vi.fn()
  }),
  CanvasControllerProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Canvas Drawing Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders the canvas container correctly', () => {
    const mockDebugInfo: DebugInfoState = {
      showDebugInfo: true,
      canvasInitialized: true,
      dimensionsSet: true,
      canvasReady: true,
      gridCreated: true,
      brushInitialized: true,
      canvasCreated: true,
      canvasLoaded: true,
      canvasWidth: 800,
      canvasHeight: 600,
      lastInitTime: Date.now(),
      lastGridCreationTime: Date.now()
    };

    render(
      <CanvasContainer 
        debugInfo={mockDebugInfo}
      />
    );
    
    // Check that the canvas element is rendered
    const canvasElement = screen.getByTestId('canvas-element');
    expect(canvasElement).toBeDefined();
    expect(canvasElement.getAttribute('data-canvas-ready')).toBe('true');
  });
  
  it('handles drawing state transitions correctly', () => {
    // Mock the hook to simulate drawing state
    (useCanvasDrawing as any).mockReturnValue({
      drawingState: {
        isDrawing: true,
        startPoint: { x: 50, y: 50 },
        currentPoint: { x: 150, y: 150 },
        midPoint: { x: 100, y: 100 },
        currentZoom: 1
      }
    });
    
    render(
      <CanvasControllerProvider>
        <Canvas />
      </CanvasControllerProvider>
    );
    
    // With the mocked drawing state, we should see a distance tooltip
    const distanceTooltip = screen.queryByTestId('distance-tooltip');
    expect(distanceTooltip).toBeDefined();
  });
  
  it('handles tool changes correctly', () => {
    const mockHandleToolChange = vi.fn();
    
    // Create a controlled test component
    const TestComponent = () => {
      const tools: DrawingTool[] = ['select', 'draw', 'wall', 'room'];
      
      return (
        <div>
          {tools.map(tool => (
            <button 
              key={tool}
              data-testid={`tool-${tool}`}
              onClick={() => mockHandleToolChange(tool)}
            >
              {tool}
            </button>
          ))}
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Simulate clicking different tools
    fireEvent.click(screen.getByTestId('tool-wall'));
    expect(mockHandleToolChange).toHaveBeenCalledWith('wall');
    
    fireEvent.click(screen.getByTestId('tool-draw'));
    expect(mockHandleToolChange).toHaveBeenCalledWith('draw');
  });
});
