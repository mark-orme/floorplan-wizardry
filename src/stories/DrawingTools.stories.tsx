
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Toolbar } from '../components/canvas/Toolbar';
import { DrawingToolbar } from '../components/DrawingToolbar';
import { SimpleGrid } from '@/components/canvas/grid/SimpleGrid';
import { SnapIndicator } from '@/components/canvas/SnapIndicator';
import { GridSettingsPanel } from '@/components/canvas/grid/GridSettingsPanel';

// Meta information for the Toolbar component
const meta = {
  title: 'Canvas/DrawingTools',
  component: Toolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive Toolbar with all tools
export const DrawingToolbarInteractive: Story = {
  render: () => {
    const [activeTool, setActiveTool] = useState(DrawingMode.SELECT);
    const [lineThickness, setLineThickness] = useState(2);
    const [lineColor, setLineColor] = useState('#000000');
    const [wallThickness, setWallThickness] = useState(5);
    const [wallColor, setWallColor] = useState('#444444');
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4">Drawing Toolbar</h2>
        <DrawingToolbar
          tool={activeTool}
          onToolChange={setActiveTool}
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
            <li><strong>Active Tool:</strong> {activeTool}</li>
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

// Grid Settings Panel
export const GridSettingsPanelStory: Story = {
  render: () => {
    const [gridSize, setGridSize] = useState(20);
    const [gridVisible, setGridVisible] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [showMeasurements, setShowMeasurements] = useState(true);
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Grid Settings Panel</h2>
        <GridSettingsPanel
          gridSize={gridSize}
          gridVisible={gridVisible}
          snapEnabled={snapEnabled}
          showMeasurements={showMeasurements}
          onGridSizeChange={setGridSize}
          onGridVisibleChange={setGridVisible}
          onSnapEnabledChange={setSnapEnabled}
          onShowMeasurementsChange={setShowMeasurements}
        />
      </div>
    );
  }
};

// Snap Indicator
export const SnapIndicatorStory: Story = {
  render: () => {
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Snap Indicator</h2>
        <div className="relative h-64 w-full border border-gray-300 bg-white">
          <SnapIndicator x={100} y={100} size={8} />
          <SnapIndicator x={200} y={150} size={10} color="red" />
          <SnapIndicator x={150} y={200} size={12} color="blue" />
        </div>
        <div className="mt-4 text-sm">
          <p>The snap indicator shows where objects will snap to on the grid.</p>
          <p>It can be customized with different sizes and colors.</p>
        </div>
      </div>
    );
  }
};

// Tool Mode Indicators
export const ToolModeIndicators: Story = {
  render: () => {
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Tool Mode Indicators</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(DrawingMode).map((mode) => (
            <div key={mode} className="flex items-center p-3 border rounded bg-white">
              <div className={`w-3 h-3 rounded-full mr-2 ${mode === DrawingMode.SELECT ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span>{mode}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
};
