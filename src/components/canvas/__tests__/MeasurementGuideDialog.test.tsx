
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
  
  it('should correctly handle dialog state based on open prop', () => {
    const handleOpenChange = vi.fn();
    
    const { rerender } = render(
      <MeasurementGuideDialog 
        open={true}
        onOpenChange={handleOpenChange}
      />
    );
    
    // Dialog should be visible when open=true
    expect(screen.getByRole('dialog')).toBeVisible();
    
    // Update to closed state
    rerender(
      <MeasurementGuideDialog 
        open={false}
        onOpenChange={handleOpenChange}
      />
    );
    
    // Dialog should not be in the document when open=false
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('should call onOpenChange when close button is clicked', () => {
    const handleOpenChange = vi.fn();
    
    render(
      <MeasurementGuideDialog 
        open={true}
        onOpenChange={handleOpenChange}
      />
    );
    
    // Click the close button
    const closeButton = screen.getByRole('button', { name: /got it/i });
    closeButton.click();
    
    // Should call onOpenChange with false
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
