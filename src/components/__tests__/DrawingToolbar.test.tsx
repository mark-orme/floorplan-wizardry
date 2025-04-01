
/**
 * Tests for DrawingToolbar component
 * @module components/__tests__/DrawingToolbar
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DrawingToolbar } from '@/components/DrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';

describe('DrawingToolbar', () => {
  // Mock props matching the actual component interface
  const mockProps = {
    tool: DrawingMode.SELECT,
    onToolChange: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onClear: vi.fn(),
    onZoom: vi.fn(),
    onSave: vi.fn(),
    gia: 0,
    isDrawing: false,
    isDirty: false,
    showControls: true,
    lineThickness: 2,
    lineColor: '#000000',
    onLineThicknessChange: vi.fn(),
    onLineColorChange: vi.fn(),
    disabled: false
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders all tool buttons', () => {
    render(<DrawingToolbar {...mockProps} />);
    
    // Check that all expected tools are rendered
    expect(screen.getByTitle('Select')).toBeInTheDocument();
    expect(screen.getByTitle('Draw')).toBeInTheDocument();
    expect(screen.getByTitle('Line')).toBeInTheDocument();
    expect(screen.getByTitle('Rectangle')).toBeInTheDocument();
    expect(screen.getByTitle('Circle')).toBeInTheDocument();
    
    // Check that operation buttons are rendered
    expect(screen.getByTitle('Undo')).toBeInTheDocument();
    expect(screen.getByTitle('Redo')).toBeInTheDocument();
    expect(screen.getByTitle('Clear Canvas')).toBeInTheDocument();
  });
  
  it('highlights the active tool', () => {
    render(<DrawingToolbar {...mockProps} />);
    
    // Find the active tool button (SELECT)
    const selectButton = screen.getByTitle('Select');
    
    // Check that it has the active class
    expect(selectButton).toHaveClass('bg-primary');
    
    // Check that other tools are not active
    const drawButton = screen.getByTitle('Draw');
    expect(drawButton).not.toHaveClass('bg-primary');
  });
  
  it('calls onToolChange when a tool is clicked', () => {
    render(<DrawingToolbar {...mockProps} />);
    
    // Click the Draw tool
    fireEvent.click(screen.getByTitle('Draw'));
    
    // Check that onToolChange was called with the correct tool
    expect(mockProps.onToolChange).toHaveBeenCalledWith(DrawingMode.DRAW);
    
    // Click the Line tool
    fireEvent.click(screen.getByTitle('Line'));
    
    // Check that onToolChange was called with the correct tool
    expect(mockProps.onToolChange).toHaveBeenCalledWith(DrawingMode.STRAIGHT_LINE);
  });
  
  it('calls operation callbacks when buttons are clicked', () => {
    render(<DrawingToolbar {...mockProps} />);
    
    // Click the Undo button
    fireEvent.click(screen.getByTitle('Undo'));
    
    // Check that onUndo was called
    expect(mockProps.onUndo).toHaveBeenCalled();
    
    // Click the Redo button
    fireEvent.click(screen.getByTitle('Redo'));
    
    // Check that onRedo was called
    expect(mockProps.onRedo).toHaveBeenCalled();
    
    // Click the Clear button
    fireEvent.click(screen.getByTitle('Clear Canvas'));
    
    // Check that onClear was called
    expect(mockProps.onClear).toHaveBeenCalled();
  });
  
  it('disables buttons when disabled prop is true', () => {
    render(
      <DrawingToolbar
        {...mockProps}
        disabled={true}
      />
    );
    
    // Check that buttons are disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
  
  it('renders with alternative props', () => {
    // Test with different tool
    render(
      <DrawingToolbar
        {...mockProps}
        tool={DrawingMode.DRAW}
      />
    );
    
    // Find the Draw button and check if it's active
    const drawButton = screen.getByTitle('Draw');
    expect(drawButton).toHaveClass('bg-primary');
    
    // Select button should not be active
    const selectButton = screen.getByTitle('Select');
    expect(selectButton).not.toHaveClass('bg-primary');
  });
});
