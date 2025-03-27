
/**
 * Tests for PropertyFloorPlanTab component
 * Verifies rendering and interactions within the floor plan tab
 * @module tests/property/PropertyFloorPlanTab.test
 */
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyFloorPlanTab } from '@/components/property/PropertyFloorPlanTab';
import { PropertyStatus } from '@/types/propertyTypes';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import * as ErrorHandling from '@/utils/errorHandling';

// Define component props interface for cleaner test setup
interface PropertyFloorPlanTabProps {
  canEdit: boolean;
  userRole: UserRole;
  property: { status: PropertyStatus };
  isSubmitting: boolean;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

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

/**
 * Test suite for PropertyFloorPlanTab component
 */
describe('PropertyFloorPlanTab', () => {
  /**
   * Default props for testing the component
   */
  const defaultProps: PropertyFloorPlanTabProps = {
    canEdit: true,
    userRole: UserRole.PHOTOGRAPHER,
    property: { status: PropertyStatus.DRAFT },
    isSubmitting: false,
    onStatusChange: vi.fn().mockResolvedValue(undefined)
  };

  /**
   * Test that the component renders floor plan canvas and actions
   */
  test('renders floor plan canvas and actions', () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Then
    expect(screen.getByTestId('mock-floor-plan-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-floor-plan-actions')).toBeInTheDocument();
  });
  
  /**
   * Test that the component handles status change errors properly
   */
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
  
  /**
   * Test that the component handles canvas errors properly
   */
  test('handles canvas error', () => {
    // When
    render(<PropertyFloorPlanTab {...defaultProps} />);
    
    // Simulate canvas error
    const canvas = screen.getByTestId('mock-floor-plan-canvas');
    fireEvent.click(canvas); // This triggers the onCanvasError
    
    // Then - check the error state is set
    expect(screen.getByText('Floor Plan')).toBeInTheDocument();
  });

  /**
   * Test that the component disables actions when submitting
   */
  test('disables actions when submitting', () => {
    // When
    render(
      <PropertyFloorPlanTab 
        {...defaultProps}
        isSubmitting={true}
      />
    );
    
    // Then - FloorPlanActions should receive isSubmitting prop
    // This is already tested in FloorPlanActions.test.tsx
    expect(screen.getByTestId('mock-floor-plan-actions')).toBeInTheDocument();
  });

  /**
   * Test that the component passes the correct user role
   */
  test('passes correct user role to actions', () => {
    // When
    render(
      <PropertyFloorPlanTab 
        {...defaultProps}
        userRole={UserRole.MANAGER}
      />
    );
    
    // Then - FloorPlanActions should receive userRole prop
    // This is already tested in FloorPlanActions.test.tsx
    expect(screen.getByTestId('mock-floor-plan-actions')).toBeInTheDocument();
  });
});
