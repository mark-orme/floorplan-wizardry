import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DrawingToolbar } from '@/components/DrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';

jest.mock('@testing-library/react', () => {
  const originalModule = jest.requireActual('@testing-library/react');
  return {
    ...originalModule,
    fireEvent: {
      ...originalModule.fireEvent,
      click: (element) => originalModule.fireEvent.click(element),
    },
  };
});

describe('DrawingToolbar', () => {
  const defaultProps = {
    activeTool: DrawingMode.SELECT,
    lineColor: '#000000',
    lineThickness: 2,
    onToolChange: vi.fn(),
    onColorChange: vi.fn(),
    onThicknessChange: vi.fn(),
    onClear: vi.fn(),
    onSave: vi.fn(),
    onImport: vi.fn(),
    onExport: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onResetZoom: vi.fn(),
    onToggleGrid: vi.fn(),
    gridVisible: false,
    canUndo: true,
    canRedo: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders toolbar with all tools', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    expect(screen.getByText('select')).toBeInTheDocument();
    expect(screen.getByText('line')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();
  });

  it('highlights active tool', () => {
    render(<DrawingToolbar {...defaultProps} activeTool={DrawingMode.STRAIGHT_LINE} />);
    
    const lineButton = screen.getByText('line').closest('button');
    const selectButton = screen.getByText('select').closest('button');
    
    expect(lineButton).toHaveClass('bg-primary');
    expect(selectButton).not.toHaveClass('bg-primary');
  });

  it('calls onToolChange when tool button is clicked', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByText('line'));
    
    expect(defaultProps.onToolChange).toHaveBeenCalledWith(DrawingMode.STRAIGHT_LINE);
  });

  it('calls onUndo when undo button is clicked', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    
    expect(defaultProps.onUndo).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    
    expect(defaultProps.onClear).toHaveBeenCalled();
  });

  it('disables undo/redo buttons when specified', () => {
    render(
      <DrawingToolbar
        {...defaultProps}
        canUndo={false}
        canRedo={false}
      />
    );
    
    const undoButton = screen.getByRole('button', { name: /undo/i });
    const redoButton = screen.getByRole('button', { name: /redo/i });
    
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('displays and updates color picker', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    const colorInput = screen.getByRole('textbox', { name: /color/i });
    
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('#ff0000');
  });

  it('displays and updates thickness input', () => {
    render(<DrawingToolbar {...defaultProps} />);
    
    const thicknessInput = screen.getByRole('spinbutton', { name: /thickness/i });
    
    fireEvent.change(thicknessInput, { target: { value: '5' } });
    
    expect(defaultProps.onThicknessChange).toHaveBeenCalledWith(5);
  });
});
