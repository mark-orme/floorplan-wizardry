
/**
 * Toolbar popover component
 * @module components/toolbar/ToolbarPopover
 */
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ToolbarPopoverProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Popover content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Popover side */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Popover alignment */
  align?: 'start' | 'center' | 'end';
}

/**
 * Toolbar popover component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarPopover: React.FC<ToolbarPopoverProps> = ({
  trigger,
  children,
  className,
  side = 'right',
  align = 'center'
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn('p-2', className)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
