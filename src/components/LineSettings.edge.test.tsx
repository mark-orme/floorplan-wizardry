
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LineSettings } from './LineSettings';

describe('LineSettings Component', () => {
  const mockSetLineColor = jest.fn();
  const mockSetLineThickness = jest.fn();

  it('should render the component with default values', () => {
    render(<LineSettings lineColor="#000000" lineThickness={2} setLineColor={mockSetLineColor} setLineThickness={mockSetLineThickness} />);
    expect(screen.getByLabelText('Color:')).toBeInTheDocument();
    expect(screen.getByLabelText('Thickness:')).toBeInTheDocument();
  });

  it('should call setLineColor when the color input changes', async () => {
    render(<LineSettings lineColor="#000000" lineThickness={2} setLineColor={mockSetLineColor} setLineThickness={mockSetLineThickness} />);
    const colorInput = screen.getByLabelText('Color:');
    
    await userEvent.click(colorInput);
    fireEvent.change(colorInput, { target: { value: '#ffffff' } });
    
    expect(mockSetLineColor).toHaveBeenCalled();
  });

  it('should call setLineThickness when the thickness input changes', () => {
    render(<LineSettings lineColor="#000000" lineThickness={2} setLineColor={mockSetLineColor} setLineThickness={mockSetLineThickness} />);
    const thicknessInput = screen.getByLabelText('Thickness:');
    fireEvent.change(thicknessInput, { target: { value: '5' } });
    expect(mockSetLineThickness).toHaveBeenCalled();
  });

  it('should display the correct color and thickness values', () => {
    render(<LineSettings lineColor="#FF0000" lineThickness={5} setLineColor={mockSetLineColor} setLineThickness={mockSetLineThickness} />);
    const colorInput = screen.getByLabelText('Color:') as HTMLInputElement;
    const thicknessInput = screen.getByLabelText('Thickness:') as HTMLInputElement;
    expect(colorInput.value).toBe('#FF0000');
    expect(thicknessInput.value).toBe('5');
  });
});
