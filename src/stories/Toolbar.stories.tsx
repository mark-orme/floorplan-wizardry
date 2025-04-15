
import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from '../components/canvas/Toolbar';
import { DrawingMode } from '@/constants/drawingModes';
import { useState } from 'react';

// Meta information for the component
const meta = {
  title: 'Canvas/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story with standard properties
export const Default: Story = {
  args: {
    activeTool: DrawingMode.SELECT,
    lineThickness: 2,
    lineColor: '#000000',
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onSave: () => {},
    onDelete: () => {},
    onLineThicknessChange: () => {},
    onLineColorChange: () => {},
  },
};

// Interactive example with working tool selection
export const Interactive: Story = {
  render: (args) => {
    const [activeTool, setActiveTool] = useState(DrawingMode.SELECT);
    const [lineThickness, setLineThickness] = useState(2);
    const [lineColor, setLineColor] = useState('#000000');
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-4xl">
        <Toolbar
          {...args}
          activeTool={activeTool}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onToolChange={setActiveTool}
          onLineThicknessChange={setLineThickness}
          onLineColorChange={setLineColor}
        />
        <div className="mt-4 p-4 bg-white rounded border">
          <p className="text-sm font-medium">Current State:</p>
          <ul className="mt-2 text-sm">
            <li><strong>Active Tool:</strong> {activeTool}</li>
            <li><strong>Line Thickness:</strong> {lineThickness}px</li>
            <li><strong>Line Color:</strong> <span className="inline-block w-4 h-4 border" style={{ backgroundColor: lineColor }}></span> {lineColor}</li>
          </ul>
        </div>
      </div>
    );
  }
};

// Story showing active straight line tool
export const StraightLineTool: Story = {
  args: {
    activeTool: DrawingMode.STRAIGHT_LINE,
    lineThickness: 2,
    lineColor: '#000000',
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onSave: () => {},
    onDelete: () => {},
    onLineThicknessChange: () => {},
    onLineColorChange: () => {},
  },
};
