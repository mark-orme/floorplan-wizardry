
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '../components/canvas/ColorPicker';
import { useState } from 'react';

// Meta information for the component
const meta = {
  title: 'Canvas/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    onChange: { action: 'colorChanged' },
    presetColors: { 
      control: 'object',
      description: 'Array of preset color values'
    }
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story
export const Default: Story = {
  args: {
    color: '#000000',
    presetColors: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  },
};

// Interactive example with state management
export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState('#3B82F6');
    
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <ColorPicker 
          color={color} 
          onChange={setColor}
          presetColors={['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']}
        />
        
        <div className="mt-4 p-4 bg-white rounded border">
          <p className="font-medium mb-2">Selected Color:</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: color }}
            ></div>
            <span>{color}</span>
          </div>
        </div>
      </div>
    );
  }
};

// Custom preset colors
export const CustomPresets: Story = {
  args: {
    color: '#6366F1',
    presetColors: ['#6366F1', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#A78BFA'],
  },
};
