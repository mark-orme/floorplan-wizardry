
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyFloorPlanTab } from '@/components/property/PropertyFloorPlanTab';
import { PropertyStatus } from '@/types/propertyTypes';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import * as ErrorHandling from '@/utils/errorHandling';

// Mock components and dependencies
vi.mock('@/components/Canvas', () => ({
  Canvas: () => <div data-testid="mock-canvas">Canvas Component</div>
}));

vi.mock('@/components/canvas/controller/CanvasController', () => ({
  CanvasControllerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-canvas-controller">{children}</div>
  )
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('@/utils/errorHandling', () => ({
  handleError: vi.fn()
}));

vi.mock('@/utils/canvas/safeCanvasInitialization', () => ({
  resetInitializationState: vi.fn()
}));

describe('PropertyFloorPlanTab', () => {
  const defaultProps = {
    canEdit: true,
    userRole: UserRole.PHOTOGRAPHER,
    property: { status: PropertyStatus.DRAFT },
    isSubmitting: false,
    onStatusChange: vi.fn().mockResolvedValue(undefined)
  };

  test('renders in loading state initially', () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Then
    const wrapper = screen.getByTestId('floor-plan-wrapper');
    expect(wrapper.getAttribute('data-canvas-ready')).toBe('false');
  });
  
  test('renders canvas after initialization', async () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Then - after the initialization delay
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    expect(screen.getByTestId('mock-canvas-controller')).toBeInTheDocument();
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });
  
  test('shows retry option when canvas initialization fails multiple times', async () => {
    // When - make initError true after initialization
    vi.useFakeTimers();
    const { rerender } = render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Advance past the initialization delay
    vi.advanceTimersByTime(600);
    
    // Simulate initialization error with multiple attempts
    rerender(
      <PropertyFloorPlanTab 
        {...defaultProps} 
        // @ts-ignore - forcing props for testing
        _testProps={{ initError: true, initAttempt: 2 }} 
      />
    );
    
    vi.useRealTimers();
    
    // Then
    expect(screen.getByText('Canvas initialization failed.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    
    // When - click retry
    fireEvent.click(screen.getByText('Try Again'));
    
    // Then
    expect(screen.queryByText('Canvas initialization failed.')).not.toBeInTheDocument();
  });
  
  test('manager can submit for review', async () => {
    // Given
    const onStatusChange = vi.fn().mockResolvedValue(undefined);
    
    // When
    render(
      <PropertyFloorPlanTab 
        canEdit={true}
        userRole={UserRole.MANAGER}
        property={{ status: PropertyStatus.DRAFT }}
        isSubmitting={false}
        onStatusChange={onStatusChange}
      />
    );
    
    // Then - after initialization
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    // When - click submit button
    const submitButton = screen.getByText('Submit for Review');
    fireEvent.click(submitButton);
    
    // Then
    expect(onStatusChange).toHaveBeenCalledWith(PropertyStatus.PENDING_REVIEW);
  });
  
  test('shows view only badge when cannot edit', async () => {
    // When
    render(
      <PropertyFloorPlanTab 
        canEdit={false}
        userRole={UserRole.PHOTOGRAPHER}
        property={{ status: PropertyStatus.COMPLETED }}
        isSubmitting={false}
        onStatusChange={vi.fn()}
      />
    );
    
    // Then
    await waitFor(() => {
      expect(screen.getByText('View Only')).toBeInTheDocument();
    }, { timeout: 600 });
  });
  
  test('handles status change error', async () => {
    // Given
    const error = new Error('Status change failed');
    const onStatusChange = vi.fn().mockRejectedValue(error);
    
    // When
    render(
      <PropertyFloorPlanTab 
        canEdit={true}
        userRole={UserRole.MANAGER}
        property={{ status: PropertyStatus.DRAFT }}
        isSubmitting={false}
        onStatusChange={onStatusChange}
      />
    );
    
    // Wait for initialization
    await waitFor(() => {
      const wrapper = screen.getByTestId('floor-plan-wrapper');
      expect(wrapper.getAttribute('data-canvas-ready')).toBe('true');
    }, { timeout: 600 });
    
    // When - click submit button
    const submitButton = screen.getByText('Submit for Review');
    fireEvent.click(submitButton);
    
    // Then
    await waitFor(() => {
      expect(ErrorHandling.handleError).toHaveBeenCalledWith(error, expect.any(Object));
    });
  });
});
