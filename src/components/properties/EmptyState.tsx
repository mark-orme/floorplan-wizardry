
import React from 'react';
import { Button } from '@/components/ui/button';
import { AiOutlinePlusCircle, AiOutlineArrowRight } from 'react-icons/ai';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  actionLabel = 'Create',
  secondaryAction,
  secondaryActionLabel = 'View Guide'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
      <div className="p-4 bg-primary/10 rounded-full">
        <AiOutlinePlusCircle size={24} className="text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 mt-6">
        {action && (
          <Button onClick={action} className="flex items-center gap-2">
            <AiOutlinePlusCircle size={16} />
            {actionLabel}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction} className="flex items-center gap-2">
            <AiOutlineArrowRight size={16} />
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
