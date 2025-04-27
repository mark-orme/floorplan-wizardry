
import { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { AiOutlineSetting, AiOutlineSun, AiOutlineMoon } from 'react-icons/ai';

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the toggle'
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the toggle'
    },
    pressed: {
      control: 'boolean',
      description: 'Whether the toggle is pressed or not'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled'
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as child component'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: 'Toggle me',
    variant: 'default',
    size: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: 'Toggle me',
    variant: 'outline',
    size: 'default',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

export const WithIcon: Story = {
  args: {
    children: <AiOutlineSetting className="h-4 w-4" />,
    'aria-label': 'Toggle settings',
  },
};

export const ThemeToggle: Story = {
  render: () => {
    // Storybook version, normally you'd use useState here
    return (
      <div className="flex space-x-2">
        <Toggle aria-label="Toggle light mode">
          <AiOutlineSun className="h-4 w-4" />
        </Toggle>
        <Toggle pressed aria-label="Toggle dark mode">
          <AiOutlineMoon className="h-4 w-4" />
        </Toggle>
      </div>
    );
  }
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const ToggleGroup: Story = {
  render: () => {
    return (
      <div className="flex border rounded-md">
        <Toggle className="rounded-none border-r data-[state=on]:bg-muted" aria-label="Bold">
          B
        </Toggle>
        <Toggle className="rounded-none border-r data-[state=on]:bg-muted" aria-label="Italic">
          I
        </Toggle>
        <Toggle className="rounded-none data-[state=on]:bg-muted" aria-label="Underline">
          U
        </Toggle>
      </div>
    );
  }
};
