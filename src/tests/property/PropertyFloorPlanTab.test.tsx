
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyFloorPlanTab } from '@/components/property/PropertyFloorPlanTab';
import { PropertyStatus } from '@/types/propertyTypes';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import * as ErrorHandling from '@/utils/errorHandling';

// Mock components and dependencies
vi.mock('@/components/property/FloorPlanCanvas', () => ({
  FloorPlanCanvas: ({ onCanvasError }: { onCanvasError: () => void }) => (
    <div data-testid="mock-floor-plan-canvas" onClick={() => onCanvasError()}>
      Canvas Component
    </div>
  )
}));

vi.mock('@/components/property/FloorPlanActions', () => ({
  FloorPlanActions: ({ onStatusChange }: { onStatusChange: (status: PropertyStatus) => Promise<void> }) => (
    <div data-testid="mock-floor-plan-actions">
      <button onClick={() => onStatusChange(PropertyStatus.PENDING_REVIEW)}>
        Submit for Review
      </button>
    </div>
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

  test('renders floor plan canvas and actions', () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Then
    expect(screen.getByTestId('mock-floor-plan-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-floor-plan-actions')).toBeInTheDocument();
  });
  
  test('handles status change error', async () => {
    // Given
    const error = new Error('Status change failed');
    const onStatusChange = vi.fn().mockRejectedValue(error);
    
    // When
    render(
      <PropertyFloorPlanTab 
        {...defaultProps}
        onStatusChange={onStatusChange}
      />
    );
    
    // When - click submit button
    const submitButton = screen.getByText('Submit for Review');
    fireEvent.click(submitButton);
    
    // Then
    await waitFor(() => {
      expect(ErrorHandling.handleError).toHaveBeenCalledWith(error, expect.any(Object));
    });
  });
  
  test('handles canvas error', () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Simulate canvas error
    const canvas = screen.getByTestId('mock-floor-plan-canvas');
    fireEvent.click(canvas); // This triggers the onCanvasError
    
    // Then - check the error state is set
    expect(screen.getByText('Floor Plan')).toBeInTheDocument();
  });
});
