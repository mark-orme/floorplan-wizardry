
import type { Meta, StoryObj } from '@storybook/react';
import { DrawingTools } from '../components/toolbar/DrawingTools';
import { DrawingMode } from '@/constants/drawingModes';

// Meta information for the component
const meta = {
  title: 'Toolbar/DrawingTools',
  component: DrawingTools,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DrawingTools>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state story
export const Default: Story = {
  args: {
    activeTool: DrawingMode.SELECT,
    onToolChange: () => {}
  },
};

// Line tool active
export const LineTool: Story = {
  args: {
    activeTool: DrawingMode.STRAIGHT_LINE,
    onToolChange: () => {}
  },
};

// Draw tool active
export const DrawTool: Story = {
  args: {
    activeTool: DrawingMode.DRAW,
    onToolChange: () => {}
  },
};
