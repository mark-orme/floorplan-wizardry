
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DrawingManager } from '@/components/canvas/DrawingManager';
import { CanvasControllerProvider } from '@/components/canvas/controller/CanvasController';

// Mock fabric canvas
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      add: vi.fn(),
      remove: vi.fn(),
      getActiveObjects: vi.fn().mockReturnValue([]),
      discardActiveObject: vi.fn(),
      requestRenderAll: vi.fn(),
      setZoom: vi.fn(),
      getZoom: vi.fn().mockReturnValue(1),
      contains: vi.fn().mockReturnValue(true),
      sendObjectToBack: vi.fn(),
      isDrawingMode: false,
      selection: true,
      defaultCursor: '',
      hoverCursor: '',
      freeDrawingBrush: {
        width: 1,
        color: '#000000'
      }
    }))
  };
});

// Mock useCanvasHistory hook
vi.mock('@/hooks/useCanvasHistory', () => ({
  useCanvasHistory: vi.fn().mockReturnValue({
    saveCurrentState: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    clearHistory: vi.fn()
  })
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('DrawingManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders toolbar with drawing tools', async () => {
    render(
      <CanvasControllerProvider>
        <DrawingManager />
      </CanvasControllerProvider>
    );
    
    // Check for drawing tool buttons
    expect(screen.getByText(/Undo/i)).toBeInTheDocument();
    expect(screen.getByText(/Redo/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Canvas/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
  });
  
  test('toggle grid button changes grid visibility', async () => {
    render(
      <CanvasControllerProvider>
        <DrawingManager />
      </CanvasControllerProvider>
    );
    
    // Find and click the grid toggle button
    const gridToggleButton = screen.getByText(/Hide Grid/i);
    expect(gridToggleButton).toBeInTheDocument();
    
    fireEvent.click(gridToggleButton);
    
    // Grid should be hidden
    await waitFor(() => {
      expect(screen.getByText(/Show Grid/i)).toBeInTheDocument();
    });
  });
});
