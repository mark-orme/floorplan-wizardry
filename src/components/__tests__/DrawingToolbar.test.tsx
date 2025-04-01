
/**
 * Tests for DrawingToolbar component
 * @module components/__tests__/DrawingToolbar
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DrawingToolbar } from '@/components/DrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';

describe('DrawingToolbar', () => {
  // Mock props
  const mockProps = {
    activeTool: DrawingMode.SELECT,
    onToolChange: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onClear: vi.fn(),
    canUndo: true,
    canRedo: false
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
  
  it('disables undo/redo buttons based on props', () => {
    render(
      <DrawingToolbar
        {...mockProps}
        canUndo={false}
        canRedo={false}
      />
    );
    
    // Check that Undo button is disabled
    const undoButton = screen.getByTitle('Undo');
    expect(undoButton).toBeDisabled();
    
    // Check that Redo button is disabled
    const redoButton = screen.getByTitle('Redo');
    expect(redoButton).toBeDisabled();
    
    // Render again with canUndo=true and canRedo=true
    render(
      <DrawingToolbar
        {...mockProps}
        canUndo={true}
        canRedo={true}
      />
    );
    
    // Check that Undo button is enabled
    const enabledUndoButton = screen.getByTitle('Undo');
    expect(enabledUndoButton).not.toBeDisabled();
    
    // Check that Redo button is enabled
    const enabledRedoButton = screen.getByTitle('Redo');
    expect(enabledRedoButton).not.toBeDisabled();
  });
  
  it('renders with alternative props', () => {
    // Test with different activeTool
    render(
      <DrawingToolbar
        {...mockProps}
        activeTool={DrawingMode.DRAW}
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
