
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LineSettings } from './LineSettings';

describe('LineSettings Component', () => {
  // Mock callback functions to verify they're called correctly
  const mockThicknessChange = vi.fn();
  const mockColorChange = vi.fn();
  
  // Default props for consistent testing
  const defaultProps = {
    thickness: 3,
    color: '#FF0000',
    onThicknessChange: mockThicknessChange,
    onColorChange: mockColorChange
  };
  
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders with correct initial values', () => {
    // When: Component is rendered with default props
    render(<LineSettings {...defaultProps} />);
    
    // Then: Should display the initial thickness and color values
    expect(screen.getByText('Thickness: 3px')).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toHaveValue('#FF0000');
  });
  
  test('calls onThicknessChange when slider value changes', () => {
    // When: Component is rendered and slider is changed
    render(<LineSettings {...defaultProps} />);
    
    // Get the slider element
    const slider = screen.getByRole('slider');
    
    // Simulate a change in the slider value
    fireEvent.change(slider, { target: { value: "5" } });
    
    // Then: Callback should be called with the new value
    expect(mockThicknessChange).toHaveBeenCalledWith(5);
  });
  
  test('calls onColorChange when color picker value changes', () => {
    // When: Component is rendered and color picker is changed
    render(<LineSettings {...defaultProps} />);
    
    // Get the color picker element
    const colorPicker = screen.getByLabelText('Color');
    
    // Simulate a change in the color picker
    fireEvent.change(colorPicker, { target: { value: '#00FF00' } });
    
    // Then: Callback should be called with the new color value
    expect(mockColorChange).toHaveBeenCalledWith('#00FF00');
  });
  
  test('handles extreme thickness values', async () => {
    // Test with minimum thickness value
    const minProps = { ...defaultProps, thickness: 1 };
    const { rerender } = render(<LineSettings {...minProps} />);
    
    // Verify minimum thickness is displayed correctly
    expect(screen.getByText('Thickness: 1px')).toBeInTheDocument();
    
    // Test with maximum thickness value
    const maxProps = { ...defaultProps, thickness: 10 };
    rerender(<LineSettings {...maxProps} />);
    
    // Verify maximum thickness is displayed correctly
    expect(screen.getByText('Thickness: 10px')).toBeInTheDocument();
  });
  
  test('renders correct container classes', () => {
    // When: Component is rendered
    render(<LineSettings {...defaultProps} />);
    
    // Then: Container should have all the expected CSS classes
    // Find the container by locating a child element first
    const container = screen.getByText('Thickness: 3px').closest('div')?.parentElement;
    
    // Verify all expected classes are applied
    expect(container).toHaveClass('bg-gray-50');
    expect(container).toHaveClass('dark:bg-gray-800');
    expect(container).toHaveClass('p-2');
    expect(container).toHaveClass('rounded');
    expect(container).toHaveClass('border');
  });
});
