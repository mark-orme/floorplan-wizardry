
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColorPicker, ColorPickerProps } from '../components/ui/color-picker';

// Updated ColorPickerProps to include presetColors
interface ExtendedColorPickerProps extends ColorPickerProps {
  presetColors?: string[];
}

const meta: Meta<ExtendedColorPickerProps> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: { control: 'color' },
    onChange: { action: 'changed' },
    presetColors: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<ExtendedColorPickerProps>;

export const Basic: Story = {
  args: {
    color: '#ff0000',
    onChange: () => {},
  },
};

export const WithPresetColors: Story = {
  render: (args) => {
    const [color, setColor] = useState('#3b82f6');
    
    return (
      <ColorPicker 
        color={color} 
        onChange={setColor} 
        presetColors={['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']} 
      />
    );
  },
};

export const Dark: Story = {
  args: {
    color: '#8b5cf6',
    onChange: () => {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
