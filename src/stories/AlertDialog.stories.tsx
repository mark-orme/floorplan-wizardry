
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog';

// Meta information for the story
const meta = {
  title: 'UI/AlertDialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    continueText: { control: 'text' },
    cancelText: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Render function for basic alert dialog
const AlertDialogDemo = ({ 
  title = 'Are you absolutely sure?', 
  description = 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
  continueText = 'Continue',
  cancelText = 'Cancel'
}) => {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="default">Open Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLastAction('canceled')}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setLastAction('confirmed')}>
              {continueText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {lastAction && (
        <div className="p-4 bg-gray-100 rounded-md text-center">
          Last action: <strong>{lastAction}</strong>
        </div>
      )}
    </div>
  );
};

// Default alert dialog example
export const Default: Story = {
  render: (args) => <AlertDialogDemo {...args} />,
  args: {
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    continueText: 'Continue',
    cancelText: 'Cancel',
  },
};

// Delete confirmation example
export const DeleteConfirmation: Story = {
  render: (args) => <AlertDialogDemo {...args} />,
  args: {
    title: 'Delete Floor Plan?',
    description: 'This will permanently delete this floor plan and all associated measurements. You cannot undo this action.',
    continueText: 'Delete',
    cancelText: 'Cancel',
  },
};

// Save changes example
export const SaveChanges: Story = {
  render: (args) => <AlertDialogDemo {...args} />,
  args: {
    title: 'Save changes before leaving?',
    description: 'You have unsaved changes that will be lost if you leave this page without saving.',
    continueText: 'Save',
    cancelText: 'Discard',
  },
};
