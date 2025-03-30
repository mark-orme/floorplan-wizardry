
/**
 * Edge case tests for LineSettings Component
 * Tests unusual inputs, interactions, and accessibility concerns
 * 
 * @module components/LineSettings.edge
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LineSettings } from './LineSettings';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setTag: vi.fn()
}));

describe('LineSettings Edge Cases', () => {
  // Mock callback functions
  const mockThicknessChange = vi.fn();
  const mockColorChange = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('handles extremely large thickness values', () => {
    // When: Component is rendered with an extreme thickness value
    render(
      <LineSettings
        thickness={1000}
        color="#FF0000"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    // Then: Should still render without errors
    expect(screen.getByText('Thickness: 1000px')).toBeInTheDocument();
    
    // The slider should have the right value
    expect(screen.getByRole('slider')).toHaveValue('1000');
  });

  test('handles very small thickness values', () => {
    // When: Component is rendered with a very small thickness value
    render(
      <LineSettings
        thickness={0.1}
        color="#FF0000"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    // Then: Should display the tiny value correctly
    expect(screen.getByText('Thickness: 0.1px')).toBeInTheDocument();
  });

  test('prevents invalid color inputs', () => {
    // When: Component is rendered with an invalid color
    render(
      <LineSettings
        thickness={3}
        color="not-a-color"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    // Then: The color picker should still have a value (fallback or original)
    const colorPicker = screen.getByLabelText('Color');
    expect(colorPicker).toHaveValue();
    
    // Should log the invalid color to Sentry
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining("Invalid color value"),
      "warning"
    );
  });

  test('is keyboard accessible', () => {
    // When: Component is rendered
    render(
      <LineSettings
        thickness={3}
        color="#FF0000"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    // Then: The slider should be focusable via tab navigation
    const slider = screen.getByRole('slider');
    slider.focus();
    expect(document.activeElement).toBe(slider);
    
    // And: Should respond to keyboard input
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(mockThicknessChange).toHaveBeenCalled();
  });

  test('accepts different color formats', () => {
    // Test color in rgb format
    render(
      <LineSettings
        thickness={3}
        color="rgb(255, 0, 0)"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    const colorPicker = screen.getByLabelText('Color');
    
    // Change to rgba format
    fireEvent.change(colorPicker, { target: { value: 'rgba(0, 255, 0, 0.5)' } });
    
    // Should translate the color appropriately
    expect(mockColorChange).toHaveBeenCalled();
  });
  
  test('provides appropriate ARIA attributes for accessibility', () => {
    render(
      <LineSettings
        thickness={3}
        color="#FF0000"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    // The slider should have appropriate aria attributes
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin');
    expect(slider).toHaveAttribute('aria-valuemax');
    expect(slider).toHaveAttribute('aria-valuenow');
    
    // Color picker should be properly labeled
    const colorPicker = screen.getByLabelText('Color');
    expect(colorPicker).toBeInTheDocument();
  });
  
  test('handles thickness slider edge boundaries', () => {
    // When: Component is rendered with values at boundaries
    render(
      <LineSettings
        thickness={0}
        color="#FF0000"
        onThicknessChange={mockThicknessChange}
        onColorChange={mockColorChange}
      />
    );
    
    const slider = screen.getByRole('slider');
    
    // Then: Should handle minimum value
    expect(slider).toHaveAttribute('min');
    
    // Try to go below minimum (should stay at minimum)
    fireEvent.change(slider, { target: { value: -10 } });
    
    // The value passed to the callback should be constrained
    const callValues = mockThicknessChange.mock.calls.map(call => call[0]);
    expect(callValues.some(val => val < 0)).toBe(false);
  });
});
