
import type { Meta, StoryObj } from '@storybook/react';
import { LineThicknessControl } from '../components/canvas/LineThicknessControl';
import { useState } from 'react';

// Meta information for the component
const meta = {
  title: 'Canvas/LineThicknessControl',
  component: LineThicknessControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    thickness: { control: { type: 'number', min: 1, max: 20 } },
    onChange: { action: 'thicknessChanged' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
} satisfies Meta<typeof LineThicknessControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story
export const Default: Story = {
  args: {
    thickness: 2,
    min: 1,
    max: 10,
    step: 1,
  },
};

// Interactive example with state management
export const Interactive: Story = {
  render: () => {
    const [thickness, setThickness] = useState(3);
    
    return (
      <div className="p-4 border rounded-md bg-gray-50 w-[300px]">
        <LineThicknessControl 
          thickness={thickness} 
          onChange={setThickness}
          min={1}
          max={10}
          step={1}
        />
        
        <div className="mt-6 p-4 bg-white rounded border">
          <p className="font-medium mb-2">Preview:</p>
          <div 
            className="w-full h-0 border-t rounded" 
            style={{ borderWidth: `${thickness}px`, borderColor: '#000' }}
          ></div>
          <p className="mt-2 text-sm text-gray-500">
            Current thickness: {thickness}px
          </p>
        </div>
      </div>
    );
  }
};

// Wide range example
export const WideRange: Story = {
  args: {
    thickness: 5,
    min: 1,
    max: 20,
    step: 1,
  },
};

// Fine control example
export const FineControl: Story = {
  args: {
    thickness: 2.5,
    min: 0.5,
    max: 5,
    step: 0.5,
  },
};
