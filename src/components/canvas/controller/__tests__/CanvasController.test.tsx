
/**
 * Unit tests for CanvasController component
 * @module canvas/controller/__tests__/CanvasController
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CanvasControllerProvider, useCanvasController } from '../CanvasController';
import { toast } from 'sonner';
import { DrawingTool } from '@/hooks/useCanvasState';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: vi.fn()
}));

// Create a test component that uses the useCanvasController hook
const TestComponent = () => {
  const {
    tool,
    handleToolChange,
    lineThickness,
    lineColor,
    handleLineThicknessChange,
    handleLineColorChange,
    floorPlans,
    currentFloor,
    handleFloorSelect,
    handleAddFloor
  } = useCanvasController();
  
  return (
    <div>
      <div data-testid="tool">{tool}</div>
      <div data-testid="line-thickness">{lineThickness}</div>
      <div data-testid="line-color">{lineColor}</div>
      <div data-testid="floor-count">{floorPlans.length}</div>
      <div data-testid="current-floor">{currentFloor}</div>
      
      <button 
        data-testid="change-tool"
        onClick={() => handleToolChange('wall')}
      >
        Change Tool
      </button>
      
      <button 
        data-testid="change-thickness"
        onClick={() => handleLineThicknessChange(4)}
      >
        Change Thickness
      </button>
      
      <button 
        data-testid="change-color"
        onClick={() => handleLineColorChange('#FF0000')}
      >
        Change Color
      </button>
      
      <button 
        data-testid="select-floor"
        onClick={() => handleFloorSelect(0)}
      >
        Select Floor
      </button>
      
      <button 
        data-testid="add-floor"
        onClick={() => handleAddFloor()}
      >
        Add Floor
      </button>
    </div>
  );
};

describe('CanvasController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should provide default values through the context', () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // Check default values
    expect(screen.getByTestId('tool').textContent).toBe('select');
    expect(screen.getByTestId('line-thickness').textContent).toBe('2');
    expect(screen.getByTestId('line-color').textContent).toBe('#000000');
    expect(screen.getByTestId('floor-count').textContent).toBe('1');
    expect(screen.getByTestId('current-floor').textContent).toBe('0');
  });
  
  it('should change the active tool', async () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // Change the tool
    fireEvent.click(screen.getByTestId('change-tool'));
    
    // Check that the tool was changed
    await waitFor(() => {
      expect(screen.getByTestId('tool').textContent).toBe('wall');
    });
    
    // Check that toast was called
    expect(toast).toHaveBeenCalledWith('Tool changed to wall');
  });
  
  it('should change line thickness', async () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // Change the line thickness
    fireEvent.click(screen.getByTestId('change-thickness'));
    
    // Check that the line thickness was changed
    await waitFor(() => {
      expect(screen.getByTestId('line-thickness').textContent).toBe('4');
    });
  });
  
  it('should change line color', async () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // Change the line color
    fireEvent.click(screen.getByTestId('change-color'));
    
    // Check that the line color was changed
    await waitFor(() => {
      expect(screen.getByTestId('line-color').textContent).toBe('#FF0000');
    });
  });
  
  it('should add a new floor', async () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // Add a new floor
    fireEvent.click(screen.getByTestId('add-floor'));
    
    // Check that the floor count was increased
    await waitFor(() => {
      expect(screen.getByTestId('floor-count').textContent).toBe('2');
    });
    
    // Check that toast was called
    expect(toast).toHaveBeenCalledWith('New floor added');
  });
  
  it('should select a floor', async () => {
    render(
      <CanvasControllerProvider>
        <TestComponent />
      </CanvasControllerProvider>
    );
    
    // First add a new floor
    fireEvent.click(screen.getByTestId('add-floor'));
    
    // Set current floor to 0
    fireEvent.click(screen.getByTestId('select-floor'));
    
    // Check that the current floor was set
    await waitFor(() => {
      expect(screen.getByTestId('current-floor').textContent).toBe('0');
    });
    
    // Check that toast was called
    expect(toast).toHaveBeenCalledWith('Floor 1 selected');
  });
});

// Create an ErrorBoundary test to verify the hook throws an error when used outside the provider
describe('useCanvasController', () => {
  // Mock console.error to avoid printing the error message during tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
  });
  
  it('should throw an error when used outside of CanvasControllerProvider', () => {
    // This will suppress the error message in the test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Wrap in a try/catch since we're expecting an error
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCanvasController must be used within a CanvasControllerProvider');
  });
});
