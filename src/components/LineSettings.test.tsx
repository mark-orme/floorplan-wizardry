
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LineSettings } from './LineSettings';

describe('LineSettings Component', () => {
  const mockThicknessChange = vi.fn();
  const mockColorChange = vi.fn();
  
  // Default props for testing
  const defaultProps = {
    thickness: 3,
    color: '#FF0000',
    onThicknessChange: mockThicknessChange,
    onColorChange: mockColorChange
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders with correct initial values', () => {
    // When
    render(<LineSettings {...defaultProps} />);
    
    // Then
    expect(screen.getByText('Thickness: 3px')).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toHaveValue('#FF0000');
  });
  
  test('calls onThicknessChange when slider value changes', () => {
    // When
    render(<LineSettings {...defaultProps} />);
    
    // Then - get slider and change its value
    const slider = screen.getByRole('slider');
    
    // Use fireEvent to simulate a change in the slider
    fireEvent.change(slider, { target: { value: 5 } });
    
    // Check if the callback was called with correct value
    expect(mockThicknessChange).toHaveBeenCalledWith(5);
  });
  
  test('calls onColorChange when color picker value changes', () => {
    // When
    render(<LineSettings {...defaultProps} />);
    
    // Then - get color picker and change its value
    const colorPicker = screen.getByLabelText('Color');
    
    // Use fireEvent to simulate a change in the color picker
    fireEvent.change(colorPicker, { target: { value: '#00FF00' } });
    
    // Check if the callback was called with correct value  
    expect(mockColorChange).toHaveBeenCalledWith('#00FF00');
  });
  
  test('handles extreme thickness values', () => {
    // Test with minimum thickness
    const minProps = { ...defaultProps, thickness: 1 };
    const { rerender } = render(<LineSettings {...minProps} />);
    
    expect(screen.getByText('Thickness: 1px')).toBeInTheDocument();
    
    // Test with maximum thickness
    const maxProps = { ...defaultProps, thickness: 10 };
    rerender(<LineSettings {...maxProps} />);
    
    expect(screen.getByText('Thickness: 10px')).toBeInTheDocument();
  });
  
  test('renders correct container classes', () => {
    // When
    render(<LineSettings {...defaultProps} />);
    
    // Then
    const container = screen.getByText('Thickness: 3px').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-gray-50');
    expect(container).toHaveClass('dark:bg-gray-800');
    expect(container).toHaveClass('p-2');
    expect(container).toHaveClass('rounded');
    expect(container).toHaveClass('border');
  });
});
