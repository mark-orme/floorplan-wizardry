
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LineSettings } from './LineSettings';

describe('LineSettings Component', () => {
  it('should render the component', () => {
    render(<LineSettings lineColor="#000000" setLineColor={() => {}} lineThickness={2} setLineThickness={() => {}} />);
    expect(screen.getByLabelText('Color:')).toBeInTheDocument();
    expect(screen.getByLabelText('Thickness:')).toBeInTheDocument();
  });

  it('should update line color when color input changes', async () => {
    const setLineColor = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={setLineColor} lineThickness={2} setLineThickness={() => {}} />);
    const colorInput = screen.getByLabelText('Color:');
    fireEvent.change(colorInput, { target: { value: '#FF0000' } });
    expect(setLineColor).toHaveBeenCalled();
  });

  it('should update line thickness when thickness input changes', async () => {
    const setLineThickness = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={() => {}} lineThickness={2} setLineThickness={setLineThickness} />);
    const thicknessInput = screen.getByLabelText('Thickness:');
    fireEvent.change(thicknessInput, { target: { value: '5' } });
    expect(setLineThickness).toHaveBeenCalled();
  });

  it('should use userEvent to simulate color change', async () => {
    const setLineColor = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={setLineColor} lineThickness={2} setLineThickness={() => {}} />);
    const colorInput = screen.getByLabelText('Color:');
    await userEvent.click(colorInput);
    fireEvent.change(colorInput, { target: { value: '#FF0000' } });
    expect(setLineColor).toHaveBeenCalled();
  });

  it('should use userEvent to simulate thickness change', async () => {
    const setLineThickness = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={() => {}} lineThickness={2} setLineThickness={setLineThickness} />);
    const thicknessInput = screen.getByLabelText('Thickness:');
    await userEvent.click(thicknessInput);
    fireEvent.change(thicknessInput, { target: { value: '5' } });
    expect(setLineThickness).toHaveBeenCalled();
  });
});

