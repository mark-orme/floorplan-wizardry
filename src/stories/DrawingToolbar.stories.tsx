
import type { Meta, StoryObj } from '@storybook/react';
import DrawingToolbar from '../components/DrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';
import { useState } from 'react';

// Meta information for the component
const meta = {
  title: 'Canvas/DrawingToolbar',
  component: DrawingToolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DrawingToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story
export const Default: Story = {
  args: {
    activeTool: DrawingMode.SELECT,
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onSave: () => {},
    lineThickness: 2,
    lineColor: '#000000',
    onThicknessChange: () => {},
    onColorChange: () => {},
    gridVisible: true,
    onToggleGrid: () => {},
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [activeTool, setActiveTool] = useState(DrawingMode.SELECT);
    const [lineThickness, setLineThickness] = useState(2);
    const [lineColor, setLineColor] = useState('#000000');
    const [showGrid, setShowGrid] = useState(true);
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-4xl">
        <DrawingToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUndo={() => console.log('Undo')}
          onRedo={() => console.log('Redo')}
          onClear={() => console.log('Clear')}
          onSave={() => console.log('Save')}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onThicknessChange={setLineThickness}
          onColorChange={setLineColor}
          gridVisible={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
        />
        
        <div className="mt-4 p-4 bg-white rounded border">
          <p className="text-sm font-medium">Current State:</p>
          <ul className="mt-2 text-sm space-y-1">
            <li><strong>Active Tool:</strong> {activeTool}</li>
            <li><strong>Line Thickness:</strong> {lineThickness}px</li>
            <li><strong>Line Color:</strong> <span className="inline-block w-4 h-4 border" style={{ backgroundColor: lineColor }}></span> {lineColor}</li>
            <li><strong>Show Grid:</strong> {showGrid ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    );
  }
};

// StraightLine Tool Active
export const StraightLineTool: Story = {
  args: {
    activeTool: DrawingMode.STRAIGHT_LINE,
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onSave: () => {},
    lineThickness: 2,
    lineColor: '#FF0000',
    onThicknessChange: () => {},
    onColorChange: () => {},
    gridVisible: true,
    onToggleGrid: () => {},
  },
};
