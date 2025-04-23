
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LineSettings } from './LineSettings';

describe('LineSettings Edge Cases', () => {
  const mockThicknessChange = vi.fn();
  const mockColorChange = vi.fn();
  
  const defaultProps = {
    thickness: 3,
    color: '#FF0000',
    onThicknessChange: mockThicknessChange,
    onColorChange: mockColorChange
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('handles non-numeric thickness values gracefully', () => {
    // @ts-ignore - Intentionally passing invalid prop to test error handling
    render(<LineSettings {...defaultProps} thickness={NaN} />);
    
    // Should fallback to a default value or at least not crash
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
  
  test('handles malformed color values', () => {
    // @ts-ignore - Intentionally passing invalid prop to test error handling
    render(<LineSettings {...defaultProps} color="not-a-color" />);
    
    // Component should render without crashing
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
  });
  
  test('handles keyboard accessibility for slider', async () => {
    render(<LineSettings {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    slider.focus();
    
    // Use userEvent for modern keyboard interactions
    await userEvent.keyboard('[ArrowRight]');
    
    // Verify callback was called
    expect(mockThicknessChange).toHaveBeenCalled();
  });
  
  test('handles color picker focus events', async () => {
    render(<LineSettings {...defaultProps} />);
    
    const colorPicker = screen.getByLabelText('Color');
    colorPicker.focus();
    
    // Just testing that the element can receive focus without errors
    expect(document.activeElement).toBe(colorPicker);
  });
  
  test('handles thickness at boundaries', () => {
    // Test with thickness at minimum allowed value (1)
    render(<LineSettings {...defaultProps} thickness={1} />);
    
    const slider = screen.getByRole('slider');
    
    // Verify slider has correct min attribute
    expect(slider).toHaveAttribute('min', '1');
    expect(screen.getByText('Thickness: 1px')).toBeInTheDocument();
    
    // Re-render with maximum value
    const { rerender } = render(<LineSettings {...defaultProps} thickness={1} />);
    rerender(<LineSettings {...defaultProps} thickness={10} />);
    
    // Verify slider has correct max attribute
    expect(slider).toHaveAttribute('max', '10');
    expect(screen.getByText('Thickness: 10px')).toBeInTheDocument();
  });
  
  test('handles string thickness values', () => {
    // @ts-ignore - Testing with string instead of number
    render(<LineSettings {...defaultProps} thickness="5" />);
    
    // Component should convert string to number
    expect(screen.getByRole('slider')).toHaveValue("5");
    expect(screen.getByText('Thickness: 5px')).toBeInTheDocument();
  });
});
