
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FloorPlanActions } from '@/components/property/FloorPlanActions';
import { PropertyStatus } from '@/types/propertyTypes';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import * as ErrorHandling from '@/utils/errorHandling';

// Define component props interface for cleaner test setup
interface FloorPlanActionsProps {
  canEdit: boolean;
  userRole: UserRole;
  isSubmitting: boolean;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

vi.mock('@/utils/errorHandling', () => ({
  handleError: vi.fn()
}));

describe('FloorPlanActions', () => {
  const defaultProps: FloorPlanActionsProps = {
    canEdit: true,
    userRole: UserRole.PHOTOGRAPHER,
    isSubmitting: false,
    onStatusChange: vi.fn().mockResolvedValue(undefined)
  };

  test('shows view only badge when cannot edit', () => {
    // When
    render(
      <FloorPlanActions 
        {...defaultProps}
        canEdit={false}
      />
    );
    
    // Then
    expect(screen.getByText('View Only')).toBeInTheDocument();
  });
  
  test('does not show submit button for regular users', () => {
    // When
    render(
      <FloorPlanActions 
        {...defaultProps}
        userRole={UserRole.PROCESSING_MANAGER} // Using an existing role that's not PHOTOGRAPHER or MANAGER
      />
    );
    
    // Then
    expect(screen.queryByText('Submit for Review')).not.toBeInTheDocument();
  });
  
  test('shows submit button for photographers', () => {
    // When
    render(<FloorPlanActions {...defaultProps} />);
    
    // Then
    expect(screen.getByText('Submit for Review')).toBeInTheDocument();
  });
  
  test('disables submit button when submitting', () => {
    // When
    render(
      <FloorPlanActions 
        {...defaultProps}
        isSubmitting={true}
      />
    );
    
    // Then
    expect(screen.getByText('Submit for Review')).toHaveAttribute('disabled');
  });
  
  test('calls onStatusChange and shows success toast when submitting for review', async () => {
    // When
    render(<FloorPlanActions {...defaultProps} />);
    
    // Click submit button
    fireEvent.click(screen.getByText('Submit for Review'));
    
    // Then
    await waitFor(() => {
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith(PropertyStatus.PENDING_REVIEW);
      expect(toast.success).toHaveBeenCalledWith("Status updated successfully");
    });
  });
  
  test('handles error when status change fails', async () => {
    // Given
    const error = new Error('Status change failed');
    const onStatusChange = vi.fn().mockRejectedValue(error);
    
    // When
    render(
      <FloorPlanActions 
        {...defaultProps}
        onStatusChange={onStatusChange}
      />
    );
    
    // Click submit button
    fireEvent.click(screen.getByText('Submit for Review'));
    
    // Then
    await waitFor(() => {
      expect(ErrorHandling.handleError).toHaveBeenCalledWith(error, expect.any(Object));
    });
  });
  
  test('shows submit button for managers', () => {
    // When
    render(
      <FloorPlanActions 
        {...defaultProps}
        userRole={UserRole.MANAGER}
      />
    );
    
    // Then
    expect(screen.getByText('Submit for Review')).toBeInTheDocument();
  });
});
