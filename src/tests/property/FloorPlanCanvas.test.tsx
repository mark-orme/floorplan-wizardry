
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FloorPlanCanvas } from '@/components/property/FloorPlanCanvas';

// Mock components and dependencies
vi.mock('@/components/Canvas', () => ({
  Canvas: ({ onError }: { onError?: () => void }) => (
    <div data-testid="mock-canvas" onClick={() => onError && onError()}>Canvas Component</div>
  )
}));

vi.mock('@/components/canvas/controller/CanvasController', () => ({
  CanvasControllerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-canvas-controller">{children}</div>
  )
}));

vi.mock('@/components/canvas/grid/SimpleGrid', () => ({
  SimpleGrid: ({ onGridCreated }: { onGridCreated?: (objects: any[]) => void }) => {
    if (onGridCreated) {
      // Mock calling the onGridCreated callback with empty array
      setTimeout(() => onGridCreated([]), 0);
    }
    return <div data-testid="mock-simple-grid">SimpleGrid Component</div>;
  }
}));

vi.mock('@/utils/canvas/safeCanvasInitialization', () => ({
  resetInitializationState: vi.fn()
}));

vi.mock('@/utils/errorHandling', () => ({
  handleError: vi.fn()
}));

describe('FloorPlanCanvas', () => {
  let onCanvasError: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    onCanvasError = vi.fn();
    // Reset any mocks between tests
    vi.clearAllMocks();
  });
  
  test('initializes canvas after short delay', async () => {
    // When
    render(<FloorPlanCanvas onCanvasError={onCanvasError} />);
    
    // Initially not ready
    const wrapper = screen.getByTestId('floor-plan-wrapper');
    expect(wrapper.getAttribute('data-canvas-ready')).toBe('false');
    
    // Then - after initialization delay
    await waitFor(() => {
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    expect(screen.getByTestId('mock-canvas-controller')).toBeInTheDocument();
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });
  
  test('calls onCanvasError when canvas has an error', async () => {
    // When
    render(<FloorPlanCanvas onCanvasError={onCanvasError} />);
    
    // Wait for canvas to initialize
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    // Simulate canvas error
    const canvas = screen.getByTestId('mock-canvas');
    fireEvent.click(canvas);
    
    // Then
    expect(onCanvasError).toHaveBeenCalled();
  });
  
  test('resets initialization state on unmount', async () => {
    const { unmount } = render(<FloorPlanCanvas onCanvasError={onCanvasError} />);
    
    // Wait for canvas to initialize
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    // When component unmounts
    unmount();
    
    // Then initialization state should be reset
    expect(require('@/utils/canvas/safeCanvasInitialization').resetInitializationState).toHaveBeenCalled();
  });
  
  test('initializes with correct class names', async () => {
    // When
    render(<FloorPlanCanvas onCanvasError={onCanvasError} />);
    
    // Wait for canvas to initialize
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    // Then
    const wrapper = screen.getByTestId('floor-plan-wrapper');
    expect(wrapper.className).toContain('relative');
    expect(wrapper.className).toContain('w-full');
    expect(wrapper.className).toContain('h-full');
    expect(wrapper.className).toContain('overflow-hidden');
  });
});
