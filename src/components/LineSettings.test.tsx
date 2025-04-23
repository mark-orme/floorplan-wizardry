
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
    
    // Simulate a change event
    fireEvent.change(colorInput, { target: { value: '#FF0000' } });
    
    // Assert that the setLineColor function was called with the new color
    expect(setLineColor).toHaveBeenCalled();
  });

  it('should update line thickness when thickness input changes', async () => {
    const setLineThickness = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={() => {}} lineThickness={2} setLineThickness={setLineThickness} />);
    const thicknessInput = screen.getByLabelText('Thickness:');
    
    // Simulate a change event
    fireEvent.change(thicknessInput, { target: { value: '5' } });
    
    // Assert that the setLineThickness function was called with the new thickness
    expect(setLineThickness).toHaveBeenCalled();
  });

  it('should use userEvent to simulate color change', async () => {
    const setLineColor = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={setLineColor} lineThickness={2} setLineThickness={() => {}} />);
    const colorInput = screen.getByLabelText('Color:');
    
    // Use userEvent to simulate a change event
    await userEvent.type(colorInput, '#FF0000');
    
    // Assert that the setLineColor function was called
    expect(setLineColor).toHaveBeenCalled();
  });

  it('should use userEvent to simulate thickness change', async () => {
    const setLineThickness = jest.fn();
    render(<LineSettings lineColor="#000000" setLineColor={() => {}} lineThickness={2} setLineThickness={setLineThickness} />);
    const thicknessInput = screen.getByLabelText('Thickness:');
    
    // Use userEvent to simulate a change event
    await userEvent.type(thicknessInput, '5');
    
    // Assert that the setLineThickness function was called
    expect(setLineThickness).toHaveBeenCalled();
  });
});
