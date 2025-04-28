import { describe, it, expect, vi } from 'vitest';
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

  it('should have proper keyboard navigation', () => {
    const handleToolChange = vi.fn();
    
    render(
      <DrawingTools 
        activeTool={DrawingMode.SELECT}
        onToolChange={handleToolChange}
      />
    );
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
  
  it('should mark the active tool appropriately for screen readers', () => {
    const handleToolChange = vi.fn();
    const ACTIVE_TOOL = DrawingMode.PENCIL;
    
    render(
      <DrawingTools 
        activeTool={ACTIVE_TOOL}
        onToolChange={handleToolChange}
      />
    );
    
    const activeButton = screen.queryAllByRole('button').find(button => {
      return button.getAttribute('data-tool') === ACTIVE_TOOL ||
             button.getAttribute('aria-pressed') === 'true' ||
             button.getAttribute('data-state') === 'active';
    });
    
    expect(activeButton).toBeDefined();
    
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
  });
});
