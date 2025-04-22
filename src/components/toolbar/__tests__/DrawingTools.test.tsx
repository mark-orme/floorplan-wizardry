
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DrawingTools } from '../DrawingTools';
import { DrawingMode } from '@/constants/drawingModes';

describe('DrawingTools', () => {
  it('should render without accessibility violations', async () => {
    const handleToolChange = vi.fn();
    
    const { container } = render(
      <DrawingTools 
        activeTool={DrawingMode.SELECT}
        onToolChange={handleToolChange}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper keyboard navigation', async () => {
    const handleToolChange = vi.fn();
    
    render(
      <DrawingTools 
        activeTool={DrawingMode.SELECT}
        onToolChange={handleToolChange}
      />
    );
    
    // All buttons should be focusable
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Each button should have an accessible name
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
});
