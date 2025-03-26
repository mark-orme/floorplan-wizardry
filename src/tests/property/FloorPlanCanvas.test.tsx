
import { describe, test, expect, vi } from 'vitest';
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

vi.mock('@/utils/canvas/safeCanvasInitialization', () => ({
  resetInitializationState: vi.fn()
}));

vi.mock('@/utils/errorHandling', () => ({
  handleError: vi.fn()
}));

describe('FloorPlanCanvas', () => {
  test('initializes canvas after short delay', async () => {
    // Given
    const onCanvasError = vi.fn();
    
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
    // Given
    const onCanvasError = vi.fn();
    
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
});
