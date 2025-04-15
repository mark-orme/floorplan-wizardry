
import type { Meta, StoryObj } from '@storybook/react';
import { DrawingToolbar } from '../components/DrawingToolbar';
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
    tool: DrawingMode.SELECT,
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onZoom: () => {},
    onSave: () => {},
    gia: 75.5,
    lineThickness: 2,
    lineColor: '#000000',
    onLineThicknessChange: () => {},
    onLineColorChange: () => {},
    showGrid: true,
    onToggleGrid: () => {},
    snapToGrid: true,
    onToggleSnap: () => {},
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [tool, setTool] = useState(DrawingMode.SELECT);
    const [lineThickness, setLineThickness] = useState(2);
    const [lineColor, setLineColor] = useState('#000000');
    const [wallThickness, setWallThickness] = useState(4);
    const [wallColor, setWallColor] = useState('#333333');
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-4xl">
        <DrawingToolbar
          tool={tool}
          onToolChange={setTool}
          onUndo={() => console.log('Undo')}
          onRedo={() => console.log('Redo')}
          onClear={() => console.log('Clear')}
          onZoom={(direction) => console.log(`Zoom ${direction}`)}
          onSave={() => console.log('Save')}
          onDelete={() => console.log('Delete')}
          gia={86.25}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onLineThicknessChange={setLineThickness}
          onLineColorChange={setLineColor}
          wallThickness={wallThickness}
          wallColor={wallColor}
          onWallThicknessChange={setWallThickness}
          onWallColorChange={setWallColor}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          snapToGrid={snapToGrid}
          onToggleSnap={() => setSnapToGrid(!snapToGrid)}
        />
        
        <div className="mt-4 p-4 bg-white rounded border">
          <p className="text-sm font-medium">Current State:</p>
          <ul className="mt-2 text-sm space-y-1">
            <li><strong>Active Tool:</strong> {tool}</li>
            <li><strong>Line Thickness:</strong> {lineThickness}px</li>
            <li><strong>Line Color:</strong> <span className="inline-block w-4 h-4 border" style={{ backgroundColor: lineColor }}></span> {lineColor}</li>
            <li><strong>Wall Thickness:</strong> {wallThickness}px</li>
            <li><strong>Wall Color:</strong> <span className="inline-block w-4 h-4 border" style={{ backgroundColor: wallColor }}></span> {wallColor}</li>
            <li><strong>Show Grid:</strong> {showGrid ? 'Yes' : 'No'}</li>
            <li><strong>Snap to Grid:</strong> {snapToGrid ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    );
  }
};

// StraightLine Tool Active
export const StraightLineTool: Story = {
  args: {
    tool: DrawingMode.STRAIGHT_LINE,
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onZoom: () => {},
    onSave: () => {},
    gia: 75.5,
    lineThickness: 2,
    lineColor: '#FF0000',
    onLineThicknessChange: () => {},
    onLineColorChange: () => {},
    showGrid: true,
    onToggleGrid: () => {},
    snapToGrid: true,
    onToggleSnap: () => {},
  },
};

// Wall Tool Active
export const WallTool: Story = {
  args: {
    tool: DrawingMode.WALL,
    onToolChange: () => {},
    onUndo: () => {},
    onRedo: () => {},
    onClear: () => {},
    onZoom: () => {},
    onSave: () => {},
    gia: 75.5,
    lineThickness: 2,
    lineColor: '#000000',
    onLineThicknessChange: () => {},
    onLineColorChange: () => {},
    wallThickness: 6,
    wallColor: '#444444',
    onWallThicknessChange: () => {},
    onWallColorChange: () => {},
    showGrid: true,
    onToggleGrid: () => {},
    snapToGrid: true,
    onToggleSnap: () => {},
  },
};
