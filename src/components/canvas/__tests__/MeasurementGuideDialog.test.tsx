
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MeasurementGuideDialog } from '../MeasurementGuideDialog';

describe('MeasurementGuideDialog', () => {
  it('should render without accessibility violations when open', async () => {
    const handleOpenChange = vi.fn();
    
    const { container } = render(
      <MeasurementGuideDialog 
        open={true}
        onOpenChange={handleOpenChange}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper dialog attributes', () => {
    const handleOpenChange = vi.fn();
    
    render(
      <MeasurementGuideDialog 
        open={true}
        onOpenChange={handleOpenChange}
      />
    );
    
    // Dialog should have a title
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Measurement Guide')).toBeInTheDocument();
    
    // Should have a close button
    const button = screen.getByRole('button', { name: /got it/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName();
  });
});
