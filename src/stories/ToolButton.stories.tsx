
import type { Meta, StoryObj } from '@storybook/react';
import { ToolButton } from '../components/canvas/ToolButton';
import { Pencil, Square, Minus, MousePointer } from 'lucide-react';

// Meta information for the component
const meta = {
  title: 'Canvas/ToolButton',
  component: ToolButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
    onClick: { action: 'clicked' },
    icon: { control: 'object' },
    tooltip: { control: 'text' },
    size: { 
      control: 'select',
      options: ['sm', 'default', 'lg']
    }
  },
} satisfies Meta<typeof ToolButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story
export const Default: Story = {
  args: {
    isActive: false,
    icon: <Pencil className="h-4 w-4" />,
    tooltip: 'Draw Tool',
    size: 'default',
  },
};

// Active state story
export const Active: Story = {
  args: {
    isActive: true,
    icon: <Pencil className="h-4 w-4" />,
    tooltip: 'Draw Tool',
    size: 'default',
  },
};

// Different sizes
export const Small: Story = {
  args: {
    isActive: false,
    icon: <Pencil className="h-4 w-4" />,
    tooltip: 'Draw Tool',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    isActive: false,
    icon: <Pencil className="h-4 w-4" />,
    tooltip: 'Draw Tool',
    size: 'lg',
  },
};

// Different tool icons
export const SelectTool: Story = {
  args: {
    isActive: false,
    icon: <MousePointer className="h-4 w-4" />,
    tooltip: 'Select Tool',
    size: 'default',
  },
};

export const LineTool: Story = {
  args: {
    isActive: false,
    icon: <Minus className="h-4 w-4" />,
    tooltip: 'Line Tool',
    size: 'default',
  },
};

export const RectangleTool: Story = {
  args: {
    isActive: false,
    icon: <Square className="h-4 w-4" />,
    tooltip: 'Rectangle Tool',
    size: 'default',
  },
};
