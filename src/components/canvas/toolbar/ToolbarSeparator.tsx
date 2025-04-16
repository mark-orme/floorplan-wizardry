
/**
 * Canvas toolbar separator component
 * @module components/canvas/toolbar/ToolbarSeparator
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarSeparatorProps {
  /** Separator orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Canvas toolbar separator component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarSeparator: React.FC<ToolbarSeparatorProps> = ({
  orientation = 'vertical',
  className
}) => {
  return (
    <div
      className={cn(
        orientation === 'vertical'
          ? 'w-px h-full min-h-[2rem] bg-border mx-2'
          : 'h-px w-full min-w-[2rem] bg-border my-2',
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
};
