import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeasurementGuideDialog } from '../MeasurementGuideDialog';

describe('MeasurementGuideDialog', () => {
  it('renders the dialog with title and description', () => {
    render(
      <MeasurementGuideDialog open={true} onOpenChange={() => {}} />
    );
    
    expect(screen.getByText('Measurement Guide')).toBeInTheDocument();
    expect(screen.getByText('Learn how to use measurement tools effectively')).toBeInTheDocument();
  });

  it('renders the guide sections', () => {
    render(
      <MeasurementGuideDialog open={true} onOpenChange={() => {}} />
    );
    
    expect(screen.getByText('Basic Measurements')).toBeInTheDocument();
    expect(screen.getByText('Snap to Grid')).toBeInTheDocument();
    expect(screen.getByText('Angle Measurements')).toBeInTheDocument();
  });

  it('renders the "Got it" button', () => {
    render(
      <MeasurementGuideDialog open={true} onOpenChange={() => {}} />
    );
    
    expect(screen.getByText('Got it')).toBeInTheDocument();
  });
});
